import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add performance indexes
PostSchema.index({ createdAt: -1 }); // For feed queries (latest first)
PostSchema.index({ authorId: 1 }); // For user's posts
PostSchema.index({ workoutSplit: 1 }); // For filtering by workout type
