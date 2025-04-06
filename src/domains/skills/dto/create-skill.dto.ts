import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSkillDto {
  /**
   * The title of the skill
   * @example JavaScript Programming
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * The description of the skill
   * @example Advanced JavaScript programming including ES6+ features
   */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * The category ID of the skill
   * @example "9"
   */
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toString())
  categoryId: string;
}
