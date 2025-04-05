import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  /**
   * The name of the category
   * @example Programming
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * The description of the category
   * @example Skills related to programming and software development
   */
  @IsString()
  @IsOptional()
  description?: string;
}