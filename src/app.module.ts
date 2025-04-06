import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';

// Domain modules
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { SkillsModule } from './domains/skills/skills.module';
import { ExchangeRequestsModule } from './domains/exchange-requests/exchange-requests.module';
import { CategoriesModule } from './domains/categories/categories.module';

@Module({
  imports: [
    // Core modules
    ConfigModule,
    CoreModule,
    PrismaModule,
    HealthModule,

    // Domain modules
    AuthModule,
    UsersModule,
    SkillsModule,
    ExchangeRequestsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
