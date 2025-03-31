import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Query,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { CreateExchangeRequestDto } from './dto/create-exchange.dto';
import { UpdateExchangeStatusDto } from './dto/update-exchange-status.dto';
import { CompleteExchangeDto } from './dto/complete-exchange.dto';
import { RespondExchangeDto } from './dto/respond-exchange.dto';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Post()
  createRequest(@Body() createExchangeDto: CreateExchangeRequestDto) {
    // In a real application, you would get the fromUserId from the authenticated user
    // For now, we'll use a mock user ID
    const mockUserId = createExchangeDto.fromUserId || 'user1';
    return this.exchangesService.createRequest(createExchangeDto, mockUserId);
  }

  @Get()
  findAll(@Query('userId') userId: string, @Query('status') status?: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.exchangesService.findAll(userId, status);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.exchangesService.findById(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateExchangeStatusDto,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.exchangesService.updateStatus(
      id,
      updateStatusDto.status,
      userId,
    );
  }

  @Post(':id/complete')
  completeExchange(
    @Param('id') id: string,
    @Body() completeExchangeDto: CompleteExchangeDto,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.exchangesService.completeExchange(
      id,
      completeExchangeDto.rating,
      completeExchangeDto.feedback,
      userId,
    );
  }

  @Post(':id/respond')
  respondToExchange(
    @Param('id') id: string,
    @Body() respondExchangeDto: RespondExchangeDto,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.exchangesService.updateStatus(
      id,
      respondExchangeDto.status,
      userId,
    );
  }
}
