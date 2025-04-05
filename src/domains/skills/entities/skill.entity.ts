export class Skill {
  /**
   * The unique identifier of the skill
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  id: string;

  /**
   * The title of the skill
   * @example JavaScript Programming
   */
  title: string;

  /**
   * The description of the skill
   * @example Advanced JavaScript programming including ES6+ features
   */
  description: string;

  /**
   * The category ID of the skill
   * @example 1
   */
  categoryId: number;

  /**
   * The user ID who owns this skill
   * @example cjld2cjxh0000qzrmn831i7rn
   */
  userId: string;

  /**
   * The date when the skill was created
   * @example 2023-01-01T00:00:00.000Z
   */
  createdAt: Date;

  /**
   * The date when the skill was last updated
   * @example 2023-01-01T00:00:00.000Z
   */
  updatedAt: Date;
}