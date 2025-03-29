import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExchangeRequestDto } from './dto/create-exchange.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExchangesService {
  constructor(private prisma: PrismaService) {}

  async createRequest(createExchangeDto: CreateExchangeRequestDto, fromUserId: string) {
    return this.prisma.exchangeRequest.create({
      data: {
        fromUserId,
        toUserId: createExchangeDto.toUserId,
        offeredSkillId: createExchangeDto.offeredSkillId,
        requestedSkillId: createExchangeDto.requestedSkillId,
        status: 'pending',
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, status?: string) {
    const where: Prisma.ExchangeRequestWhereInput = {
      OR: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
      isActive: true,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    return this.prisma.exchangeRequest.findMany({
      where,
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
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
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!exchangeRequest) {
      throw new NotFoundException('Exchange request not found');
    }

    return exchangeRequest;
  }

  async updateStatus(id: string, status: string, userId: string) {
    const exchangeRequest = await this.findById(id);

    // Only the recipient can accept/reject the request
    if (exchangeRequest.toUserId !== userId) {
      throw new Error('You are not authorized to update this exchange request');
    }

    const updatedRequest = await this.prisma.exchangeRequest.update({
      where: { id },
      data: { status },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If the request is accepted, create an exchange record
    if (status === 'accepted') {
      await this.prisma.exchange.create({
        data: {
          requestId: id,
        },
      });
    }

    return updatedRequest;
  }

  async completeExchange(id: string, rating: number, feedback: string | undefined, userId: string) {
    const exchangeRequest = await this.findById(id);
    
    // Check if the exchange exists
    const exchange = await this.prisma.exchange.findUnique({
      where: { requestId: id },
    });

    if (!exchange) {
      throw new NotFoundException('Exchange not found');
    }

    // Determine if the user is the sender or receiver
    const isFromUser = exchangeRequest.fromUserId === userId;
    const isToUser = exchangeRequest.toUserId === userId;

    if (!isFromUser && !isToUser) {
      throw new Error('You are not authorized to rate this exchange');
    }

    // Update the appropriate rating field
    const updateData: any = {};
    if (isFromUser) {
      updateData.fromUserRating = rating;
    } else {
      updateData.toUserRating = rating;
    }

    // Only add feedback if it's provided
    if (feedback) {
      updateData.feedback = feedback;
    }

    return this.prisma.exchange.update({
      where: { id: exchange.id },
      data: updateData,
    });
  }
}
