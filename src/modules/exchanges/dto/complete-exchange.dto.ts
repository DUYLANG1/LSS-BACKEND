import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CompleteExchangeDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}