import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: {
        title: createSkillDto.title,
        description: createSkillDto.description,
        categoryId: parseInt(createSkillDto.category),
        userId: createSkillDto.userId
      },
    });
  }
}