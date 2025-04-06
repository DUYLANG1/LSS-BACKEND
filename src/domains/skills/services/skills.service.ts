import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';

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

  async findAll() {
    return this.prisma.skill.findMany({
      where: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });
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
