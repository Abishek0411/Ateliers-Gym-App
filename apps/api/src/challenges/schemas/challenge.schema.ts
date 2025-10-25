import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChallengeDocument = Challenge & Document;

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    type: {
      url: String,
      publicId: String,
    },
  })
  heroImage?: { url: string; publicId?: string }; // Cloudinary

  @Prop({ required: true, enum: ['streak', 'daily', 'task'] })
  type: 'streak' | 'daily' | 'task';

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({
    type: [
      {
        day: Number,
        task: String,
      },
    ],
    default: [],
  })
  tasks?: { day: number; task: string }[];

  @Prop({ default: [] })
  tags: string[]; // e.g., ['30-day','fat-loss','bulk']

  @Prop({ default: true })
  isActive: boolean;

  // Cached stats for performance
  @Prop({ default: 0 })
  totalParticipants: number;

  @Prop({ default: 0 })
  averageCompletion: number; // percentage

  @Prop({ default: [] })
  cachedLeaderboard: Array<{
    userGymId: string;
    userName: string;
    percentComplete: number;
    completedCount: number;
    longestStreak: number;
    currentStreak: number;
  }>;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

// Indexes for performance
ChallengeSchema.index({ startDate: 1, endDate: 1 });
ChallengeSchema.index({ type: 1, isActive: 1 });
ChallengeSchema.index({ tags: 1 });
