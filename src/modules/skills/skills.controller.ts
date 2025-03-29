import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { FindAllSkillsDto } from './dto/find-all-skills.dto';

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
}
