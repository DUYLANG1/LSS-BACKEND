import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;
}