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
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    // Verify user exists
    await this.findById(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateProfileDto,
    });

    // Return the same structure as findById for consistency
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      bio: updatedUser.bio,
      location: updatedUser.location,
      createdAt: updatedUser.createdAt,
    };
  }

  async getUserSkills(userId: string) {
    // Verify user exists and get user info
    const user = await this.findById(userId);

    const skills = await this.prisma.skill.findMany({
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

    // Add user information to each skill
    return skills.map((skill) => ({
      ...skill,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    }));
  }
}
