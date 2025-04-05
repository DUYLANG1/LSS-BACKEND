import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateSkillDto {
  /**
   * The title of the skill
   * @example JavaScript Programming
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * The description of the skill
   * @example Advanced JavaScript programming including ES6+ features
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * The category ID of the skill
   * @example 1
   */
  @IsInt()
  @IsOptional()
  categoryId?: number;
}