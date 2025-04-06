import { Controller, Get, Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { Public } from './core/decorators/public.decorator';

@Controller()
@Injectable()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Public()
  @Get()
  getHello() {
    return {
      message: `Hello from backend ${this.configService.port}`,
    };
  }
}
