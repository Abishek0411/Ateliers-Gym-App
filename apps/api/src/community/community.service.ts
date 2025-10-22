import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, Comment } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
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

  // New methods for enhanced functionality
  async getMyPosts(
    userGymId: string,
    pagination: PaginationQueryDto
  ): Promise<{ posts: Post[]; hasMore: boolean; nextCursor?: string }> {
    const { limit = 20, cursor } = pagination;

    const query: Record<string, unknown> = { authorId: userGymId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await this.postModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1) // Get one extra to check if there are more
      .exec();

    const hasMore = posts.length > limit;
    const resultPosts = hasMore ? posts.slice(0, -1) : posts;
    const nextCursor = hasMore
      ? (resultPosts[resultPosts.length - 1] as any).createdAt.toISOString()
      : undefined;

    return {
      posts: resultPosts,
      hasMore,
      nextCursor,
    };
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    currentUser: User
  ): Promise<Post> {
    if (!this.isValidObjectId(postId)) {
      throw new NotFoundException('Invalid post ID format');
    }

    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user is author or admin
    if (post.authorId !== currentUser.gymId && currentUser.role !== 'admin') {
      throw new ForbiddenException('You can only edit your own posts');
    }

    // Update post with new data
    const updateData: Record<string, unknown> = { ...updatePostDto };

    // If media is being updated, extract new Cloudinary data
    if (updatePostDto.mediaUrl) {
      updateData.mediaType = this.getMediaType(updatePostDto.mediaUrl);
      updateData.cloudinaryPublicId = this.extractPublicId(
        updatePostDto.mediaUrl
      );
      updateData.cloudinaryResourceType = this.getMediaType(
        updatePostDto.mediaUrl
      );
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(postId, updateData, { new: true })
      .exec();

    return updatedPost;
  }

  async toggleLike(
    postId: string,
    userGymId: string
  ): Promise<{ likesCount: number; liked: boolean }> {
    if (!this.isValidObjectId(postId)) {
      throw new NotFoundException('Invalid post ID format');
    }

    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isLiked = post.likes.includes(userGymId);

    if (isLiked) {
      // Remove like
      await this.postModel
        .findByIdAndUpdate(
          postId,
          { $pull: { likes: userGymId } },
          { new: true }
        )
        .exec();
    } else {
      // Add like
      await this.postModel
        .findByIdAndUpdate(
          postId,
          { $addToSet: { likes: userGymId } },
          { new: true }
        )
        .exec();
    }

    // Get updated post to return accurate counts
    const updatedPost = await this.postModel.findById(postId).exec();
    return {
      likesCount: updatedPost.likes.length,
      liked: !isLiked,
    };
  }

  async addComment(
    postId: string,
    userGymId: string,
    userName: string,
    addCommentDto: AddCommentDto
  ): Promise<Comment> {
    if (!this.isValidObjectId(postId)) {
      throw new NotFoundException('Invalid post ID format');
    }

    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const newComment: Comment = {
      _id: new (await import('mongoose')).Types.ObjectId(),
      userId: userGymId,
      userName,
      text: addCommentDto.text,
      createdAt: new Date(),
    };

    await this.postModel
      .findByIdAndUpdate(
        postId,
        { $push: { comments: newComment } },
        { new: true }
      )
      .exec();

    return newComment;
  }

  async deleteComment(
    postId: string,
    commentId: string,
    currentUser: User
  ): Promise<void> {
    if (!this.isValidObjectId(postId) || !this.isValidObjectId(commentId)) {
      throw new NotFoundException('Invalid post or comment ID format');
    }

    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user is comment author or admin
    if (comment.userId !== currentUser.gymId && currentUser.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.postModel
      .findByIdAndUpdate(
        postId,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      )
      .exec();
  }

  private isValidObjectId(id: string): boolean {
    // MongoDB ObjectId validation (24 hex characters)
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}
