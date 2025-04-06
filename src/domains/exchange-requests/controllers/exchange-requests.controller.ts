import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ExchangeRequestsService } from '../services/exchange-requests.service';
import { CreateExchangeRequestDto } from '../dto/create-exchange-request.dto';
import { UpdateExchangeRequestDto } from '../dto/update-exchange-request.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

// @ApiTags('Exchange Requests')
// @ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exchange-requests')
export class ExchangeRequestsController {
  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
  ) {}

  /**
   * Create a new exchange request
   * @returns The created exchange request
   */
  @Post()
  create(
    @Body() createExchangeRequestDto: CreateExchangeRequestDto,
    @Query('userId') userId?: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.exchangeRequestsService.create(
      createExchangeRequestDto,
      userId,
    );
  }

  /**
   * Get all exchange requests
   * @returns All exchange requests
   */
  @Get()
  findAll() {
    return this.exchangeRequestsService.findAll();
  }

  /**
   * Get an exchange request by ID
   * @returns The exchange request with the specified ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeRequestsService.findOne(id);
  }

  /**
   * Get exchange requests sent by a user
   * @returns The exchange requests sent by the specified user
   */
  @Get('sent/:userId')
  findSentByUser(@Param('userId') userId: string) {
    return this.exchangeRequestsService.findSentByUser(userId);
  }

  /**
   * Get exchange requests received by a user
   * @returns The exchange requests received by the specified user
   */
  @Get('received/:userId')
  findReceivedByUser(@Param('userId') userId: string) {
    return this.exchangeRequestsService.findReceivedByUser(userId);
  }

  /**
   * Update an exchange request status
   * @returns The updated exchange request
   */
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateExchangeRequestDto: UpdateExchangeRequestDto,
    @Query('userId') userId?: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.exchangeRequestsService.updateStatus(
      id,
      updateExchangeRequestDto,
      userId,
    );
  }

  /**
   * Delete an exchange request
   * @returns The deleted exchange request
   */
  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.exchangeRequestsService.remove(id, userId);
  }
}
