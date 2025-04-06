import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS configuration
  app.enableCors({
    origin: configService.corsOrigin,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global API prefix with exclusion for root route
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });

  // Swagger documentation (requires @nestjs/swagger to be installed)
  try {
    const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle('LSS API')
      .setDescription('The LSS API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    logger.log(
      `Swagger documentation available at: http://localhost:${configService.port}/api-docs`,
    );
  } catch (error) {
    logger.warn(
      'Swagger module not available. Run "npm install --save @nestjs/swagger swagger-ui-express" to enable API documentation.',
    );
  }

  // Start the server
  const port = configService.port;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
