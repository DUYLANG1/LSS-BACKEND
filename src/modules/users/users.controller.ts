import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Query('userId') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.usersService.findById(userId);
  }

  @Put('profile')
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Get('skills')
  getUserSkills(@Query('userId') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.usersService.getUserSkills(userId);
  }
}
