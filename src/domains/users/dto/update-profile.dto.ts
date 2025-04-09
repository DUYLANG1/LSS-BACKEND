import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  /**
   * The name of the user
   * @example John Doe
   */
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  /**
   * The email of the user
   * @example john.doe@example.com
   */
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * The avatar URL of the user
   * @example https://example.com/avatar.jpg
   */
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  /**
   * The bio of the user
   * @example Software developer with 5 years of experience
   */
  @IsString()
  @MaxLength(500)
  @IsOptional()
  bio?: string;

  /**
   * The location of the user
   * @example New York, USA
   */
  @IsString()
  @MaxLength(100)
  @IsOptional()
  location?: string;
}
