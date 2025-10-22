import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Comment subdocument schema
@Schema({ _id: true })
export class Comment {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  authorRole: 'member' | 'trainer' | 'admin';

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  workoutSplit:
    | 'Push'
    | 'Pull'
    | 'Legs'
    | 'Full Body'
    | 'Upper'
    | 'Lower'
    | 'Cardio'
    | 'Other';

  @Prop({ type: [String], default: [] })
  musclesWorked: string[];

  @Prop()
  mediaUrl?: string;

  @Prop()
  mediaType?: 'image' | 'video';

  // Optimized Cloudinary storage
  @Prop()
  cloudinaryPublicId?: string;

  @Prop()
  cloudinaryResourceType?: 'image' | 'video';

  // Social features
  @Prop({ type: [String], default: [] })
  likes: string[]; // Array of gymIds who liked the post

  @Prop({ type: [Comment], default: [] })
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add performance indexes
PostSchema.index({ createdAt: -1 }); // For feed queries (latest first)
PostSchema.index({ authorId: 1 }); // For user's posts
PostSchema.index({ workoutSplit: 1 }); // For filtering by workout type
PostSchema.index({ 'comments.createdAt': -1 }); // For comment sorting
