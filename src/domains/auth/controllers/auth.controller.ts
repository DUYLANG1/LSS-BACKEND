import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Public } from '../../../core/decorators/public.decorator';

// @ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login with email and password
   * @returns JWT token and user information
   */
  @Public()
  @Post('signin')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  /**
   * Register a new user
   * @returns The created user and JWT token
   */
  @Public()
  @Post('signup')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
