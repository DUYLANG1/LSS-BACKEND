import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
   * @example "9"
   */
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value ? value.toString() : undefined))
  categoryId?: string;
}
