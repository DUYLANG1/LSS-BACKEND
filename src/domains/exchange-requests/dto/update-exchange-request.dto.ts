import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateExchangeRequestDto {
  /**
   * The status of the exchange request
   * @example accepted
   * @enum ['pending', 'accepted', 'rejected']
   */
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'accepted', 'rejected'])
  status: string;
}