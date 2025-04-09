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
    const { page = 1, limit = 9, search = '', category } = params;
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
      ...(category ? { categoryId: category } : {}),
    };

    // Standard include for skill queries
    const includeOptions = {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    };

    // Get total count for pagination
    const total = await this.prisma.skill.count({ where: baseWhere });

    // Calculate pagination metadata
    const paginationMeta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };

    // If no currentUserId is provided, return a simple paginated list
    if (!currentUserId) {
      const skills = await this.prisma.skill.findMany({
        where: baseWhere,
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });

      return { data: skills, meta: paginationMeta };
    }

    // For authenticated users, we need to add metadata about ownership and requests

    // First, get pending exchange requests made by the current user
    const userExchangeRequests = await this.prisma.exchangeRequest.findMany({
      where: {
        fromUserId: currentUserId,
        status: 'pending',
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        requestedSkillId: true,
        status: true,
      },
    });

    // Create a map of requested skill IDs for quick lookup
    const requestedSkillIds = new Set(
      userExchangeRequests.map((req) => req.requestedSkillId),
    );

    // Create a map of exchange requests by skill ID
    const exchangeRequestMap = new Map();
    userExchangeRequests.forEach((req) => {
      exchangeRequestMap.set(req.requestedSkillId, req);
    });

    // Get skills owned by the current user (for prioritization)
    const userOwnedSkillsCount = await this.prisma.skill.count({
      where: {
        ...baseWhere,
        userId: currentUserId,
      },
    });

    // Get skills that have been requested by the current user
    const requestedSkillsCount = requestedSkillIds.size;

    // Calculate the total number of skills that will be prioritized
    const prioritizedCount = userOwnedSkillsCount + requestedSkillsCount;

    // Adjust pagination to account for prioritized skills
    let adjustedSkip = skip;
    let adjustedLimit = limit;

    // If we're on the first page, we need to fetch enough skills to account for prioritized ones
    if (page === 1) {
      adjustedLimit = limit + prioritizedCount;
      adjustedSkip = 0;
    } else {
      // For subsequent pages, adjust the skip to account for prioritized skills on first page
      adjustedSkip = skip - prioritizedCount + limit;
      if (adjustedSkip < 0) adjustedSkip = 0;
    }

    // Fetch paginated skills with the adjusted pagination
    const skills = await this.prisma.skill.findMany({
      where: baseWhere,
      include: includeOptions,
      orderBy: { createdAt: 'desc' },
      skip: adjustedSkip,
      take: adjustedLimit,
    });

    // Add metadata to each skill
    const skillsWithMetadata = skills.map((skill) => {
      const isOwnedByCurrentUser = skill.userId === currentUserId;
      const hasBeenRequestedByCurrentUser = requestedSkillIds.has(skill.id);
      const exchangeRequest = exchangeRequestMap.get(skill.id);

      return {
        ...skill,
        isOwnedByCurrentUser,
        hasBeenRequestedByCurrentUser,
        exchangeRequestId: hasBeenRequestedByCurrentUser
          ? exchangeRequest?.id
          : null,
        exchangeRequestStatus: hasBeenRequestedByCurrentUser
          ? exchangeRequest?.status
          : null,
        // Add a priority field for sorting
        priority: hasBeenRequestedByCurrentUser
          ? 1
          : isOwnedByCurrentUser
            ? 2
            : 3,
      };
    });

    // Sort skills by priority (1: requested, 2: owned, 3: others)
    skillsWithMetadata.sort((a, b) => a.priority - b.priority);

    // Apply final pagination to get exactly the requested number of skills
    const paginatedSkills = skillsWithMetadata.slice(0, limit);

    return {
      data: paginatedSkills,
      meta: paginationMeta,
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
            avatarUrl: true,
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
