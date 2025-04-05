import { IsNotEmpty, IsString, IsInt } from 'class-validator';

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
   * @example 1
   */
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}