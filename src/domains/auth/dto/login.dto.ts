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
   * @example 123
   * @minLength 3
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}
