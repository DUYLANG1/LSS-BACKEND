import { Controller, Get, Injectable } from '@nestjs/common';
import { Public } from '../core/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

// Conditionally import Swagger if available
let ApiTags = () => {
  return (target: any) => {
    return target;
  };
};

try {
  const swagger = require('@nestjs/swagger');
  if (swagger && swagger.ApiTags) {
    ApiTags = swagger.ApiTags;
  }
} catch (e) {
  // Swagger not available
}

// Conditionally import Terminus if available
let HealthCheck = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    return descriptor;
  };
};

@ApiTags('Health')
@Controller('health')
@Injectable()
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get()
  async check() {
    try {
      // Simple health check that tests database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        details: {
          database: {
            status: 'up',
          },
        },
      };
    } catch (error) {
      return {
        status: 'error',
        details: {
          database: {
            status: 'down',
            message: error.message,
          },
        },
      };
    }
  }
}