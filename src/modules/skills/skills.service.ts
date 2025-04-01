import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Prisma } from '@prisma/client';
import { FindAllSkillsDto } from './dto/find-all-skills.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: {
        title: createSkillDto.title,
        description: createSkillDto.description,
        categoryId: parseInt(createSkillDto.category),
        userId: createSkillDto.userId,
      },
    });
  }

  async findAll(query: FindAllSkillsDto) {
    const where: Prisma.SkillWhereInput = {
      isActive: true,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Handle both categoryId and category parameters
    const categoryFilter = query.categoryId || query.category;
    if (categoryFilter) {
      // Try to parse as integer first (for direct ID)
      const categoryId = parseInt(categoryFilter);
      
      if (!isNaN(categoryId)) {
        // If it's a valid number, use it directly
        where.categoryId = categoryId;
      } else {
        // If it's not a number, try to find the category by name
        const category = await this.prisma.category.findFirst({
          where: {
            name: {
              contains: categoryFilter,
              mode: 'insensitive',
            },
          },
        });
        
        if (category) {
          where.categoryId = category.id;
        }
      }
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [total, skills] = await Promise.all([
      this.prisma.skill.count({ where }),
      this.prisma.skill.findMany({
        where,
        include: {
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      skills,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findById(id: string) {
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
          },
        },
      },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    const skill = await this.findById(id);
    
    const data: any = {};
    
    if (updateSkillDto.title) {
      data.title = updateSkillDto.title;
    }
    
    if (updateSkillDto.description) {
      data.description = updateSkillDto.description;
    }
    
    if (updateSkillDto.category) {
      data.categoryId = parseInt(updateSkillDto.category);
    }
    
    return this.prisma.skill.update({
      where: { id },
      data,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const skill = await this.findById(id);
    
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
