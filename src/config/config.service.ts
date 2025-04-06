import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get<T>(key: string): T {
    const value = this.configService.get<T>(key);
    if (value === undefined) {
      throw new Error(`Configuration key "${key}" is undefined`);
    }
    return value;
  }

  get nodeEnv(): string {
    return this.get<string>('app.nodeEnv');
  }

  get port(): number {
    return this.get<number>('app.port');
  }

  get corsOrigin(): string {
    return this.get<string>('app.corsOrigin');
  }

  get databaseUrl(): string {
    return this.get<string>('database.url');
  }

  get jwtSecret(): string {
    return this.get<string>('auth.jwtSecret');
  }

  get jwtExpiresIn(): string {
    return this.get<string>('auth.jwtExpiresIn');
  }
}
