import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User as AuthUser } from '../auth/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if gymId already exists
    const existingUser = await this.userModel
      .findOne({ gymId: createUserDto.gymId })
      .exec();
    if (existingUser) {
      throw new ConflictException('User with this Gym ID already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create user
    const userData = {
      ...createUserDto,
      passwordHash,
      membershipType: createUserDto.membershipType || 'Basic',
    };

    // Remove password from DTO before saving
    delete (userData as { password?: string }).password;

    const createdUser = new this.userModel(userData);
    const savedUser = await createdUser.save();

    return this.toUserResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().sort({ createdAt: -1 }).exec();
    return users.map(user => this.toUserResponseDto(user));
  }

  async findByGymId(gymId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ gymId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserResponseDto(user);
  }

  async updateUser(
    gymId: string,
    updateUserDto: UpdateUserDto,
    currentUser: AuthUser
  ): Promise<UserResponseDto> {
    // Check if user exists
    const user = await this.userModel.findOne({ gymId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check permissions (user can update themselves, admin can update anyone)
    if (currentUser.gymId !== gymId && currentUser.role !== 'admin') {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Update user
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { gymId },
        { ...updateUserDto, lastLogin: new Date() },
        { new: true }
      )
      .exec();

    return this.toUserResponseDto(updatedUser);
  }

  async deleteUser(gymId: string, currentUser: AuthUser): Promise<void> {
    // Only admin can delete users
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.userModel.findOne({ gymId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.findOneAndDelete({ gymId }).exec();
  }

  async validateUser(gymId: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ gymId }).exec();
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.userModel
      .findOneAndUpdate({ gymId }, { lastLogin: new Date() })
      .exec();

    return user;
  }

  private toUserResponseDto(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      gymId: user.gymId,
      name: user.name,
      role: user.role,
      membershipType: user.membershipType,
      email: user.email,
      phone: user.phone,
      profileImageUrl: user.profileImageUrl,
      achievements: user.achievements,
      favoriteWorkouts: user.favoriteWorkouts,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
