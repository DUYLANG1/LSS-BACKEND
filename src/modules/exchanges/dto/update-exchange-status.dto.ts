import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateExchangeStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'accepted', 'rejected'])
  status: string;
}