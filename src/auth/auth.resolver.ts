import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './types/user.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('username') username: string,
    @Args('password') password: string
  ) {
    const result = await this.authService.login(username, password);
    return result.access_token;
  }

  @Mutation(() => String)
  async register(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ) {
    await this.authService.register(createUserDto);
    return 'User has been registered!'
  }
}
