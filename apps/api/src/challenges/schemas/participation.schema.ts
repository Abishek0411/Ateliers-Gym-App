import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipationDocument = Participation & Document;

@Schema({ timestamps: true })
export class Participation {
  @Prop({ required: true, index: true })
  challengeId: string;

  @Prop({ required: true, index: true })
  userGymId: string; // gymId from user

  @Prop()
  userName: string;

  @Prop({
    default: [],
    type: [
      {
        day: Number,
        completed: Boolean,
        updatedAt: Date,
      },
    ],
  })
  progress: { day: number; completed: boolean; updatedAt: Date }[];

  @Prop({ default: 0 })
  completedCount: number;

  @Prop({ default: 0 })
  currentStreak: number; // for streak-type challenges

  @Prop({ default: 0 })
  longestStreak: number;

  @Prop({ default: 0 })
  percentComplete: number; // cached percent

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>; // for badges etc

  @Prop()
  joinedAt: Date;

  @Prop()
  lastActivityAt: Date;
}

export const ParticipationSchema = SchemaFactory.createForClass(Participation);

// Unique compound index to prevent duplicate participations
ParticipationSchema.index({ challengeId: 1, userGymId: 1 }, { unique: true });

// Indexes for leaderboard queries
ParticipationSchema.index({
  challengeId: 1,
  percentComplete: -1,
  completedCount: -1,
});
ParticipationSchema.index({ userGymId: 1 });
