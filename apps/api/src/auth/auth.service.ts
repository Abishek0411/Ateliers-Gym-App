import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './interfaces/user.interface';
import { findUserByGymId, validatePassword } from './data/mock-users';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(gymId: string, password: string): Promise<User | null> {
    const user = findUserByGymId(gymId);
    if (!user) {
      return null;
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User): Promise<AuthResponseDto> {
    const payload = {
      sub: user.gymId,
      name: user.name,
      role: user.role,
      membershipType: user.membershipType,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        gymId: user.gymId,
        name: user.name,
        role: user.role,
        membershipType: user.membershipType,
        joinDate: user.joinDate,
      },
    };
  }

  async getProfile(gymId: string): Promise<Partial<User>> {
    const user = findUserByGymId(gymId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
