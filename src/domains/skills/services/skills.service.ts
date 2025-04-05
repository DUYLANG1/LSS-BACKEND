import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto, userId: string) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createSkillDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.skill.create({
      data: {
        ...createSkillDto,
        userId,
      },
      include: {
        category: true,
      },
    });
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
    // Check if skill exists
    const skill = await this.findOne(id);

    // Check if user owns the skill
    if (skill.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this skill');
    }

    // If categoryId is provided, verify it exists
    if (updateSkillDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateSkillDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.skill.update({
      where: { id },
      data: updateSkillDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    // Check if skill exists
    const skill = await this.findOne(id);

    // Check if user owns the skill
    if (skill.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this skill');
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