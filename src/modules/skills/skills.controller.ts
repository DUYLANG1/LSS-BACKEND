
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { FindAllSkillsDto } from './dto/find-all-skills.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  findAll(@Query() query: FindAllSkillsDto) {
    return this.skillsService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.skillsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
