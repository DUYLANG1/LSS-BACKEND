import { Module } from '@nestjs/common';
import { ExchangeRequestsController } from './controllers/exchange-requests.controller';
import { ExchangeRequestsService } from './services/exchange-requests.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExchangeRequestsController],
  providers: [ExchangeRequestsService],
  exports: [ExchangeRequestsService],
})
export class ExchangeRequestsModule {}