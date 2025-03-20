import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserDalService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({username});
  }

  async createUser(username: string, password: string, role: string): Promise<User> {
    const newUser = this.userRepository.create({ username, password, role });
    return this.userRepository.save(newUser);
  }
}