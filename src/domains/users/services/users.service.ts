import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            sentRequests: true,
            receivedRequests: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Transform the user object to return only what we need
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    // Verify user exists
    await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data: updateProfileDto,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        createdAt: true,
      },
    });
  }

  async getUserSkills(userId: string) {
    // Verify user exists
    await this.findById(userId);

    return this.prisma.skill.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}