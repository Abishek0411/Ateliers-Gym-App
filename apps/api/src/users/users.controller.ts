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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '../auth/interfaces/user.interface';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

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

  // Profile management endpoints
  @Get('me')
  async getMyProfile(@Request() req: { user: User }): Promise<UserResponseDto> {
    return this.usersService.getMyProfile(req.user.gymId);
  }

  @Patch('me')
  async updateMyProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: { user: User }
  ): Promise<UserResponseDto> {
    return this.usersService.updateMyProfile(req.user.gymId, updateProfileDto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: User }
  ): Promise<UserResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed.'
      );
    }

    // Validate file size (5MB limit for avatars)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size too large. Maximum size is 5MB.'
      );
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'ateliers-avatars',
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'face' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      const uploadResult = result as { secure_url: string; public_id: string };

      return this.usersService.uploadAvatar(req.user.gymId, {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    } catch (error) {
      throw new BadRequestException('Failed to upload avatar to Cloudinary');
    }
  }

  @Post('me/measurements')
  async addMeasurement(
    @Body() createMeasurementDto: CreateMeasurementDto,
    @Request() req: { user: User }
  ): Promise<UserResponseDto> {
    return this.usersService.addMeasurement(
      req.user.gymId,
      createMeasurementDto
    );
  }

  @Patch('me/measurements/:measurementId')
  async updateMeasurement(
    @Param('measurementId') measurementId: string,
    @Body() updateMeasurementDto: UpdateMeasurementDto,
    @Request() req: { user: User }
  ): Promise<UserResponseDto> {
    return this.usersService.updateMeasurement(
      req.user.gymId,
      measurementId,
      updateMeasurementDto
    );
  }

  @Delete('me/measurements/:measurementId')
  async deleteMeasurement(
    @Param('measurementId') measurementId: string,
    @Request() req: { user: User }
  ): Promise<{ message: string }> {
    await this.usersService.deleteMeasurement(req.user.gymId, measurementId);
    return { message: 'Measurement deleted successfully' };
  }
}
