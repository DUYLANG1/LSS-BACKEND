import { Module } from '@nestjs/common';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ExchangesController],
  providers: [ExchangesService, PrismaService]
})
export class ExchangesModule {}
