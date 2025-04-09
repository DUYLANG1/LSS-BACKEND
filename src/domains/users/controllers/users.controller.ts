import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

// @ApiTags('Users')
// @ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get user profile by query parameter
   * @returns The user profile information
   */
  @Get('profile')
  getProfile(@Query('userId') userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.usersService.findById(userId);
  }

  /**
   * Get user profile by path parameter
   * @returns The user profile information
   */
  @Get('profile/:userId')
  getProfileByParam(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  /**
   * Update user profile
   * @returns The updated user profile
   */
  @Put('profile/:userId')
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Param('userId') userId?: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  /**
   * Get user skills by query parameter
   * @returns The skills of the specified user
   */
  @Get('skills')
  getUserSkillsByQuery(@Query('userId') userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.usersService.getUserSkills(userId);
  }

  /**
   * Get user skills by path parameter
   * @returns The skills of the specified user
   */
  @Get('skills/:userId')
  getUserSkillsByParam(@Param('userId') userId: string) {
    return this.usersService.getUserSkills(userId);
  }
}
