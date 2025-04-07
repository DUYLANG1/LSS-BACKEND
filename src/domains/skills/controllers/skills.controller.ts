import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SkillsService } from '../services/skills.service';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { FindSkillsDto } from '../dto/find-skills.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { User } from '../../../core/decorators/user.decorator';
import { Public } from '../../../core/decorators/public.decorator';
import { Request } from 'express';

// Define a custom interface that extends Express Request
interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

// @ApiTags('Skills')
// @ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  /**
   * Create a new skill
   * @returns The created skill
   */
  @Post()
  async create(
    @Body() createSkillDto: CreateSkillDto,
    @User('id') userId: string,
    @Req() req: RequestWithUser,
  ) {
    console.log('Request user:', req.user);
    console.log('User ID from decorator:', userId);
    console.log('Create DTO:', createSkillDto);

    // If userId is undefined, try to get it from req.user
    let effectiveUserId = userId || req.user?.id || req.user?.sub;

    // If we still don't have a userId but we have an email, look up the user
    if (!effectiveUserId && req.user?.email) {
      try {
        const user = await this.skillsService.findUserByEmail(req.user.email);
        if (user) {
          effectiveUserId = user.id;
          console.log('Found user ID from email:', effectiveUserId);
        }
      } catch (error) {
        console.error('Error finding user by email:', error);
      }
    }

    if (!effectiveUserId) {
      throw new Error('User ID could not be determined from the JWT token');
    }

    return this.skillsService.create(createSkillDto, effectiveUserId);
  }

  /**
   * Get all skills with pagination and search
   * @returns Paginated skills with total count
   */
  @Public()
  @Get()
  async findAll(
    @Query() findSkillsDto: FindSkillsDto,
    @Req() req: RequestWithUser,
  ) {
    console.log('Request user in findAll:', req.user);
    console.log('Query params:', findSkillsDto);

    // Try to get the user ID if the user is authenticated
    let currentUserId = req.user?.id || req.user?.sub;
    console.log('Initial currentUserId from token:', currentUserId);

    // If we have an email but no ID, look up the user
    if (!currentUserId && req.user?.email) {
      try {
        const user = await this.skillsService.findUserByEmail(req.user.email);
        if (user) {
          currentUserId = user.id;
          console.log('Found currentUserId from email lookup:', currentUserId);
        }
      } catch (error) {
        console.error('Error finding user by email:', error);
        // Continue without user ID if lookup fails
      }
    }

    console.log('Final currentUserId being passed to service:', currentUserId);

    return this.skillsService.findAll(findSkillsDto, currentUserId);
  }

  /**
   * Create a new skill for a specific user (direct user ID in path)
   * @returns The created skill
   */
  @Post(':userId')
  createForUserDirect(
    @Body() createSkillDto: CreateSkillDto,
    @Param('userId') userId: string,
  ) {
    return this.skillsService.create(createSkillDto, userId);
  }

  /**
   * Get a skill by ID
   * @returns The skill with the specified ID
   */
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  /**
   * Update a skill
   * @returns The updated skill
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @User('id') userId: string,
    @Req() req: RequestWithUser,
  ) {
    // If userId is undefined, try to get it from req.user
    let effectiveUserId = userId || req.user?.id || req.user?.sub;

    // If we still don't have a userId but we have an email, look up the user
    if (!effectiveUserId && req.user?.email) {
      try {
        const user = await this.skillsService.findUserByEmail(req.user.email);
        if (user) {
          effectiveUserId = user.id;
          console.log('Found user ID from email:', effectiveUserId);
        }
      } catch (error) {
        console.error('Error finding user by email:', error);
      }
    }

    if (!effectiveUserId) {
      throw new Error('User ID could not be determined from the JWT token');
    }

    return this.skillsService.update(id, updateSkillDto, effectiveUserId);
  }

  /**
   * Delete a skill
   * @returns The deleted skill
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @User('id') userId: string,
    @Req() req: RequestWithUser,
  ) {
    // If userId is undefined, try to get it from req.user
    let effectiveUserId = userId || req.user?.id || req.user?.sub;

    // If we still don't have a userId but we have an email, look up the user
    if (!effectiveUserId && req.user?.email) {
      try {
        const user = await this.skillsService.findUserByEmail(req.user.email);
        if (user) {
          effectiveUserId = user.id;
          console.log('Found user ID from email:', effectiveUserId);
        }
      } catch (error) {
        console.error('Error finding user by email:', error);
      }
    }

    if (!effectiveUserId) {
      throw new Error('User ID could not be determined from the JWT token');
    }

    return this.skillsService.remove(id, effectiveUserId);
  }
}
