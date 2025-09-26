import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../auth/interfaces/user.interface';

@Injectable()
export class CommunityService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const postData = {
      authorId: user.gymId,
      authorName: user.name,
      authorRole: user.role,
      text: createPostDto.text,
      workoutSplit: createPostDto.workoutSplit,
      musclesWorked: createPostDto.musclesWorked,
      mediaUrl: createPostDto.mediaUrl,
      mediaType: createPostDto.mediaUrl
        ? this.getMediaType(createPostDto.mediaUrl)
        : undefined,
      // Store Cloudinary public ID for optimized transformations
      cloudinaryPublicId: createPostDto.mediaUrl
        ? this.extractPublicId(createPostDto.mediaUrl)
        : undefined,
      cloudinaryResourceType: createPostDto.mediaUrl
        ? this.getMediaType(createPostDto.mediaUrl)
        : undefined,
    };

    const createdPost = new this.postModel(postData);
    return await createdPost.save();
  }

  async getFeed(): Promise<Post[]> {
    return await this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async deletePost(postId: string, user: User): Promise<void> {
    // Validate ObjectId format
    if (!this.isValidObjectId(postId)) {
      throw new NotFoundException('Invalid post ID format');
    }

    const post = await this.postModel.findById(postId).exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user is author or admin
    if (post.authorId !== user.gymId && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postModel.findByIdAndDelete(postId).exec();
  }

  async getPostById(postId: string): Promise<Post> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  private getMediaType(url: string): 'image' | 'video' {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];

    const lowerUrl = url.toLowerCase();

    if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
      return 'image';
    } else if (videoExtensions.some(ext => lowerUrl.includes(ext))) {
      return 'video';
    }

    // Default to image for Cloudinary URLs
    return 'image';
  }

  private extractPublicId(url: string): string {
    // Extract public ID from Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename
    const match = url.match(/\/upload\/v\d+\/(.+)$/);
    return match ? match[1] : '';
  }

  private isValidObjectId(id: string): boolean {
    // MongoDB ObjectId validation (24 hex characters)
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}
