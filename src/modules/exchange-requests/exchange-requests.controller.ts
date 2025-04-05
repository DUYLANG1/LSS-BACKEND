import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ExchangesService } from './exchange-requests.service';
import { CreateExchangeRequestDto } from './dto/create-exchange.dto';
import { RespondExchangeDto } from './dto/respond-exchange.dto';

@Controller('exchange-requests')
export class ExchangeRequestsController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Post()
  createRequest(@Body() createExchangeDto: CreateExchangeRequestDto) {
    // In a real application, you would get the fromUserId from the authenticated user
    const mockUserId = createExchangeDto.fromUserId || 'user1';
    return this.exchangesService.createRequest(createExchangeDto, mockUserId);
  }

  @Get('status')
  async findByStatus(
    @Query('userId') userId: string,
    @Query('skillId') skillId?: string,
    @Query('status') status?: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    const exchanges = await this.exchangesService.findAllWithSkills(
      userId,
      status,
      skillId,
    );

    // If we're looking for a specific exchange by skillId, return the first one
    if (skillId && exchanges.length > 0) {
      return { exchange: exchanges[0] };
    }

    return { exchanges };
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: string,
    @Query('status') status?: string,
  ) {
    const exchanges = await this.exchangesService.findAllWithSkills(
      userId,
      status,
    );
    return { exchanges };
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
