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
  UnauthorizedException,
} from '@nestjs/common';
import { SkillsService } from '../services/skills.service';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

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
  create(@Body() createSkillDto: CreateSkillDto, @Query('userId') userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.skillsService.create(createSkillDto, userId);
  }

  /**
   * Get all skills
   * @returns All skills
   */
  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  /**
   * Get a skill by ID
   * @returns The skill with the specified ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  /**
   * Update a skill
   * @returns The updated skill
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @Query('userId') userId?: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.skillsService.update(id, updateSkillDto, userId);
  }

  /**
   * Delete a skill
   * @returns The deleted skill
   */
  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.skillsService.remove(id, userId);
  }
}