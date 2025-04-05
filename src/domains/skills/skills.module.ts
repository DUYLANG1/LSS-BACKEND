import { Module } from '@nestjs/common';
import { SkillsController } from './controllers/skills.controller';
import { SkillsService } from './services/skills.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}