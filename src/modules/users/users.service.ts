import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService extends BaseService {
  constructor(private prismaService: PrismaService) {
    super(prismaService);
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        skills: true,
      },
    });
  }

  async delete(id: string) {
    return this.softDelete('user', id);
  }
}
