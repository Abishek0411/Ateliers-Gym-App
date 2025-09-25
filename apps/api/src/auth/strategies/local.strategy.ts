import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'gymId',
      passwordField: 'password',
    });
  }

  async validate(gymId: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(gymId, password);
    if (!user) {
      throw new UnauthorizedException('Invalid gym ID or password');
    }
    return user;
  }
}
