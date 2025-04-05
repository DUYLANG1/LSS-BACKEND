import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { Public } from '../../../core/decorators/public.decorator';

// Swagger decorators - comment these out if @nestjs/swagger is not installed
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// @ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // @ApiOperation({ summary: 'Create a new category' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Returns the created category'
  // })
  // @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // @ApiOperation({ summary: 'Get all categories' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns all categories'
  // })
  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // @ApiOperation({ summary: 'Get a category by ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the category with the specified ID'
  // })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  // @ApiOperation({ summary: 'Update a category' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the updated category'
  // })
  // @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  // @ApiOperation({ summary: 'Delete a category' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the deleted category'
  // })
  // @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}