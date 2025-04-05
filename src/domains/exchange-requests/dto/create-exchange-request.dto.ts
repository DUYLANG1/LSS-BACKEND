import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExchangeRequestDto {
  /**
   * The ID of the user to send the exchange request to
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  @IsString()
  @IsNotEmpty()
  toUserId: string;

  /**
   * The ID of the skill being offered
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  @IsString()
  @IsNotEmpty()
  offeredSkillId: string;

  /**
   * The ID of the skill being requested
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  @IsString()
  @IsNotEmpty()
  requestedSkillId: string;
}
