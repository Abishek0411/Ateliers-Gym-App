import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '../auth/interfaces/user.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Request() req: { user: User }
  ): Promise<UserResponseDto> {
    // Only admin can create users
    if (req.user.role !== 'admin') {
      throw new Error('Only admins can create users');
    }
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll(@Request() req: { user: User }): Promise<UserResponseDto[]> {
    // Only admin can list all users
    if (req.user.role !== 'admin') {
      throw new Error('Only admins can view all users');
    }
    return this.usersService.findAll();
  }

  @Get(':gymId')
  async findByGymId(
    @Param('gymId') gymId: string,
    @Request() req: { user: User }
  ): Promise<UserResponseDto> {
    // Users can view their own profile, admins can view any profile
    if (req.user.gymId !== gymId && req.user.role !== 'admin') {
      throw new Error('You can only view your own profile');
    }
    return this.usersService.findByGymId(gymId);
  }

  @Patch(':gymId')
  async updateUser(
    @Param('gymId') gymId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: User }
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(gymId, updateUserDto, req.user);
  }

  @Delete(':gymId')
  async deleteUser(
    @Param('gymId') gymId: string,
    @Request() req: { user: User }
  ): Promise<{ message: string }> {
    await this.usersService.deleteUser(gymId, req.user);
    return { message: 'User deleted successfully' };
  }
}
