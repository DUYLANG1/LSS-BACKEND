import { IsString, IsNotEmpty } from 'class-validator';

export class RespondExchangeDto {
  @IsString()
  @IsNotEmpty()
  status: 'accepted' | 'rejected';
}