import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Your Next.js frontend URL
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Add global prefix for all routes
  // app.setGlobalPrefix('api/v1');

  await app.listen(4000);
}
bootstrap();
