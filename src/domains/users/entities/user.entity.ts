export class User {
  /**
   * The unique identifier of the user
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  id: string;

  /**
   * The name of the user
   * @example John Doe
   */
  name: string;

  /**
   * The email of the user
   * @example john.doe@example.com
   */
  email: string;

  /**
   * The avatar URL of the user
   * @example https://example.com/avatar.jpg
   */
  avatar?: string;

  /**
   * The bio of the user
   * @example Software developer with 5 years of experience
   */
  bio?: string;

  /**
   * The location of the user
   * @example New York, USA
   */
  location?: string;

  /**
   * The rating of the user
   * @example 4.5
   */
  rating?: number;

  /**
   * The number of completed exchanges
   * @example 10
   */
  completedExchanges?: number;

  /**
   * The date when the user was created
   * @example 2023-01-01T00:00:00.000Z
   */
  createdAt: Date;

  /**
   * The date when the user was last updated
   * @example 2023-01-01T00:00:00.000Z
   */
  updatedAt: Date;
}