import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Prisma } from '@prisma/client';
import { FindAllSkillsDto } from './dto/find-all-skills.dto';

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

    if (query.categoryId) {
      where.categoryId = parseInt(query.categoryId);
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
}
