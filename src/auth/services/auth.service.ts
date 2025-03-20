import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from '../helpers/incryption.helper';
import { UserDalService } from './user-dal.service';
import User from '../../db/entities/user.entity';
import { CreateUserDto } from '../types/user.dto';

@Injectable()
export class AuthService {
  constructor(private userDalService: UserDalService, private jwtService: JwtService) {}

  private async validateUser(username: string, password: string) {
    const user = await this.userDalService.getUserByUsername(username);
    if (user && await comparePasswords(password, user.password)) {
      return { id: user.id, username: user.username, role: user.role };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  public async login(email: string, password: string): Promise<{access_token: string}> {
    const user = await this.validateUser(email, password);
    const payload = { id: user.id, email: user.username, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userDalService.getUserByUsername(createUserDto.username);
    if (existingUser) throw new ConflictException('User already exists');

    const hashedPassword = await hashPassword(createUserDto.password);
    return this.userDalService.createUser(createUserDto.username, hashedPassword, createUserDto.role);
  }
}
