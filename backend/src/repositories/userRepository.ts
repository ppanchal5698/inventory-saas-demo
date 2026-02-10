import { BaseRepository } from './baseRepository';
import { User } from '../models/user';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ where: { email } });
  }
}

export const userRepository = new UserRepository();
