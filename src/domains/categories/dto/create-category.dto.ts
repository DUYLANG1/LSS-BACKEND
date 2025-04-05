import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  /**
   * The name of the category
   * @example Programming
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The description of the category
   * @example Skills related to programming and software development
   */
  @IsString()
  @IsOptional()
  description?: string;
}