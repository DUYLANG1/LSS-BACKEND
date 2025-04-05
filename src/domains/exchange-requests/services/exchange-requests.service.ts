import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateExchangeRequestDto } from '../dto/create-exchange-request.dto';
import { UpdateExchangeRequestDto } from '../dto/update-exchange-request.dto';

@Injectable()
export class ExchangeRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(createExchangeRequestDto: CreateExchangeRequestDto, userId: string) {
    const { toUserId, offeredSkillId, requestedSkillId } = createExchangeRequestDto;

    // Verify offered skill exists and belongs to the user
    const offeredSkill = await this.prisma.skill.findUnique({
      where: {
        id: offeredSkillId,
        userId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!offeredSkill) {
      throw new NotFoundException('Offered skill not found or does not belong to you');
    }

    // Verify requested skill exists and belongs to the target user
    const requestedSkill = await this.prisma.skill.findUnique({
      where: {
        id: requestedSkillId,
        userId: toUserId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!requestedSkill) {
      throw new NotFoundException('Requested skill not found or does not belong to the target user');
    }

    // Check if a similar request already exists
    const existingRequest = await this.prisma.exchangeRequest.findFirst({
      where: {
        fromUserId: userId,
        toUserId,
        offeredSkillId,
        requestedSkillId,
        status: 'pending',
        isActive: true,
        deletedAt: null,
      },
    });

    if (existingRequest) {
      throw new BadRequestException('A similar exchange request already exists');
    }

    return this.prisma.exchangeRequest.create({
      data: {
        fromUserId: userId,
        toUserId,
        offeredSkillId,
        requestedSkillId,
        status: 'pending',
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.exchangeRequest.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        toUser: {
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
    const exchangeRequest = await this.prisma.exchangeRequest.findUnique({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!exchangeRequest) {
      throw new NotFoundException('Exchange request not found');
    }

    return exchangeRequest;
  }

  async findSentByUser(userId: string) {
    return this.prisma.exchangeRequest.findMany({
      where: {
        fromUserId: userId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        toUser: {
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

  async findReceivedByUser(userId: string) {
    return this.prisma.exchangeRequest.findMany({
      where: {
        toUserId: userId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        toUser: {
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

  async updateStatus(
    id: string,
    updateExchangeRequestDto: UpdateExchangeRequestDto,
    userId: string,
  ) {
    const exchangeRequest = await this.findOne(id);

    // Check if user is the recipient of the request
    if (exchangeRequest.toUserId !== userId) {
      throw new ForbiddenException('You do not have permission to update this exchange request');
    }

    // Check if request is already accepted or rejected
    if (exchangeRequest.status !== 'pending') {
      throw new BadRequestException(`Exchange request is already ${exchangeRequest.status}`);
    }

    const { status } = updateExchangeRequestDto;

    // Update exchange request status
    const updatedRequest = await this.prisma.exchangeRequest.update({
      where: { id },
      data: { status },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // If request is accepted, create an exchange record
    if (status === 'accepted') {
      await this.prisma.exchange.create({
        data: {
          requestId: id,
        },
      });
    }

    return updatedRequest;
  }

  async remove(id: string, userId: string) {
    const exchangeRequest = await this.findOne(id);

    // Check if user is the sender of the request
    if (exchangeRequest.fromUserId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this exchange request');
    }

    // Check if request is already accepted
    if (exchangeRequest.status === 'accepted') {
      throw new BadRequestException('Cannot delete an accepted exchange request');
    }

    // Soft delete
    return this.prisma.exchangeRequest.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }
}