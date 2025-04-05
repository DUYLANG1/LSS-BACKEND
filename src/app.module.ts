import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ExchangesRequestsModule } from './modules/exchange-requests/exchange-requests.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CategoriesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    SkillsModule,
    ExchangesRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
