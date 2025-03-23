import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExchangeRequestDto {
  @IsString()
  @IsNotEmpty()
  toUserId: string;

  @IsString()
  @IsNotEmpty()
  offeredSkillId: string;

  @IsString()
  @IsNotEmpty()
  requestedSkillId: string;
}
