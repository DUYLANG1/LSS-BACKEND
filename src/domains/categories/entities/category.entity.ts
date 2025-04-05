export class Category {
  /**
   * The unique identifier of the category
   * @example 1
   */
  id: number;

  /**
   * The name of the category
   * @example Programming
   */
  name: string;

  /**
   * The description of the category
   * @example Skills related to programming and software development
   */
  description?: string;

  /**
   * The date when the category was created
   * @example 2023-01-01T00:00:00.000Z
   */
  createdAt: Date;

  /**
   * The date when the category was last updated
   * @example 2023-01-01T00:00:00.000Z
   */
  updatedAt: Date;
}
