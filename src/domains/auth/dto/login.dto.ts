import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  /**
   * The email of the user
   * @example john.doe@example.com
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user
   * @example password123
   * @minLength 6
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}