import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            skills: {
              where: {
                isActive: true,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    // Transform the response to include skillsCount
    return categories.map((category) => {
      const { _count, ...categoryData } = category;
      return {
        ...categoryData,
        skillsCount: _count.skills,
      };
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    // Check if category exists
    await this.findOne(id);

    // Soft delete
    return this.prisma.category.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }
}
