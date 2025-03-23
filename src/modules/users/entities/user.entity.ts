import { Exclude } from 'class-transformer';

export class User {
  id: string;
  email: string;
  name: string;

  @Exclude()
  password: string;

  avatar?: string;
  bio?: string;
  location?: string;
  rating?: number;
  completedExchanges?: number;
  createdAt: Date;
  updatedAt: Date;
}
