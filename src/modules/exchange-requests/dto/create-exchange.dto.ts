import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
  
  @IsString()
  @IsOptional()
  fromUserId?: string; // This would be set by the auth middleware in a real app
}
