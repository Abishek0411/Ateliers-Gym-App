import {
  Controller,
  Get,
  Post,
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
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UploadResponseDto } from './dto/upload-response.dto';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { User } from '../auth/interfaces/user.interface';

@Controller('community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly configService: ConfigService
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  @Post('post')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: { user: User }
  ) {
    const user = req.user as User;
    return this.communityService.createPost(createPostDto, user);
  }

  @Get('feed')
  async getFeed() {
    return this.communityService.getFeed();
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @Request() req: { user: User }) {
    const user = req.user as User;
    await this.communityService.deletePost(id, user);
    return { message: 'Post deleted successfully' };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images and videos are allowed.'
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size too large. Maximum size is 10MB.'
      );
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto', // Automatically detect image or video
            folder: 'ateliers-community',
            transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      const uploadResult = result as { secure_url: string; public_id: string };

      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload file to Cloudinary');
    }
  }
}
