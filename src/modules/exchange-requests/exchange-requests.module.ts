import { Module } from '@nestjs/common';
import { ExchangeRequestsController } from './exchange-requests.controller';
import { ExchangesService } from './exchange-requests.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ExchangeRequestsController],
  providers: [ExchangesService, PrismaService],
})
export class ExchangesRequestsModule {}
