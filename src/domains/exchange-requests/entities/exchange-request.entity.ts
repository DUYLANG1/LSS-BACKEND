import { User } from '../../users/entities/user.entity';

export class ExchangeRequest {
  /**
   * The unique identifier of the exchange request
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  id: string;

  /**
   * The ID of the user who sent the exchange request
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  fromUserId: string;

  /**
   * The ID of the user who received the exchange request
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  toUserId: string;

  /**
   * The ID of the skill being offered
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  offeredSkillId: string;

  /**
   * The ID of the skill being requested
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  requestedSkillId: string;

  /**
   * The status of the exchange request
   * @example pending
   * @enum ['pending', 'accepted', 'rejected']
   */
  status: string;

  /**
   * The user who sent the exchange request
   */
  fromUser: User;

  /**
   * The user who received the exchange request
   */
  toUser: User;

  /**
   * The date when the exchange request was created
   * @example 2023-01-01T00:00:00.000Z
   */
  createdAt: Date;

  /**
   * The date when the exchange request was last updated
   * @example 2023-01-01T00:00:00.000Z
   */
  updatedAt: Date;
}
