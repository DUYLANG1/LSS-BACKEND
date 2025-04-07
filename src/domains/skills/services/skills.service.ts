import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { FindSkillsDto } from '../dto/find-skills.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async create(createSkillDto: CreateSkillDto, userId: string) {
    try {
      // Verify category exists
      const categoryId = parseInt(createSkillDto.categoryId, 10);

      if (isNaN(categoryId)) {
        throw new BadRequestException(
          `Invalid categoryId: ${createSkillDto.categoryId}. Must be a valid number.`,
        );
      }

      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      // Check if userId is defined
      if (!userId) {
        throw new BadRequestException('User ID is required to create a skill');
      }

      return this.prisma.skill.create({
        data: {
          title: createSkillDto.title,
          description: createSkillDto.description,
          category: {
            connect: { id: categoryId },
          },
          user: {
            connect: { id: userId },
          },
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      // Re-throw Nest exceptions as is
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      // For Prisma errors or other errors, provide more context
      throw new BadRequestException(`Failed to create skill: ${error.message}`);
    }
  }

  async findAll(params: FindSkillsDto = {}, currentUserId?: string) {
    const { page = 1, limit = 9, search = '' } = params;
    const skip = (page - 1) * limit;

    // Build the base where clause
    const baseWhere = {
      isActive: true,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    };

    // If no currentUserId is provided, just return skills ordered by creation date
    if (!currentUserId) {
      // Get total count for pagination
      const total = await this.prisma.skill.count({ where: baseWhere });

      // Get paginated skills
      const skills = await this.prisma.skill.findMany({
        where: baseWhere,
        include: {
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        data: skills,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      };
    }

    // If currentUserId is provided, we need to implement custom ordering
    console.log('Current User ID:', currentUserId);

    // First, find all exchange requests where the current user is involved
    const userExchangeRequests = await this.prisma.exchangeRequest.findMany({
      where: {
        OR: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
        status: 'pending',
        isActive: true,
        deletedAt: null,
      },
    });

    console.log('User exchange requests found:', userExchangeRequests.length);

    // Get IDs of skills that the current user has requested from others
    const requestedSkillIds = userExchangeRequests
      .filter((req) => req.fromUserId === currentUserId)
      .map((req) => req.requestedSkillId);

    console.log('Skills requested by user:', requestedSkillIds.length);

    // Get total count for pagination (this doesn't change)
    const total = await this.prisma.skill.count({ where: baseWhere });

    // We'll fetch skills in three separate queries and combine them

    // 1. First, get skills that the current user has requested from others
    const requestedSkills =
      requestedSkillIds.length > 0
        ? await this.prisma.skill.findMany({
            where: {
              id: { in: requestedSkillIds },
              ...baseWhere,
            },
            include: {
              category: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          })
        : [];

    console.log('Requested skills found:', requestedSkills.length);

    // 2. Next, get skills owned by the current user
    const userOwnedSkills = await this.prisma.skill.findMany({
      where: {
        userId: currentUserId,
        id: { notIn: requestedSkillIds }, // Exclude any that might be in the first group
        ...baseWhere,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    console.log('User owned skills found:', userOwnedSkills.length);

    // 3. Finally, get remaining skills
    const remainingSkillsCount =
      limit - requestedSkills.length - userOwnedSkills.length;
    const remainingSkills =
      remainingSkillsCount > 0
        ? await this.prisma.skill.findMany({
            where: {
              userId: { not: currentUserId },
              id: { notIn: requestedSkillIds }, // Exclude skills from first group
              ...baseWhere,
            },
            include: {
              category: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: remainingSkillsCount,
            skip,
          })
        : [];

    console.log('Remaining skills found:', remainingSkills.length);

    // Combine all skills in the desired order
    const combinedSkills = [
      ...requestedSkills,
      ...userOwnedSkills,
      ...remainingSkills,
    ];

    // Add metadata to each skill
    const skillsWithMetadata = combinedSkills.map((skill) => {
      const isOwnedByCurrentUser = skill.userId === currentUserId;
      const hasBeenRequestedByCurrentUser = requestedSkillIds.includes(
        skill.id,
      );

      return {
        ...skill,
        isOwnedByCurrentUser,
        hasBeenRequestedByCurrentUser,
        hasBeenRequestedByOthers: false, // Not needed for ordering but keeping for consistency
      };
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Log the final order for debugging
    console.log(
      'Final order - first few skills:',
      skillsWithMetadata.slice(0, 3).map((s) => ({
        id: s.id,
        title: s.title,
        isOwnedByCurrentUser: s.isOwnedByCurrentUser,
        hasBeenRequestedByCurrentUser: s.hasBeenRequestedByCurrentUser,
      })),
    );

    return {
      data: skillsWithMetadata,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto, userId: string) {
    try {
      // Check if skill exists
      const skill = await this.findOne(id);

      // Check if user owns the skill
      if (skill.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to update this skill',
        );
      }

      // If categoryId is provided, verify it exists
      let categoryId: number | undefined = undefined;
      if (updateSkillDto.categoryId) {
        categoryId = parseInt(updateSkillDto.categoryId, 10);

        if (isNaN(categoryId)) {
          throw new BadRequestException(
            `Invalid categoryId: ${updateSkillDto.categoryId}. Must be a valid number.`,
          );
        }

        const category = await this.prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          throw new NotFoundException(
            `Category with ID ${categoryId} not found`,
          );
        }
      }

      return this.prisma.skill.update({
        where: { id },
        data: {
          title: updateSkillDto.title,
          description: updateSkillDto.description,
          categoryId: categoryId,
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      // Re-throw Nest exceptions as is
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      // For Prisma errors or other errors, provide more context
      throw new BadRequestException(`Failed to update skill: ${error.message}`);
    }
  }

  async remove(id: string, userId: string) {
    // Check if skill exists
    const skill = await this.findOne(id);

    // Check if user owns the skill
    if (skill.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this skill',
      );
    }

    // Soft delete
    return this.prisma.skill.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }
}
