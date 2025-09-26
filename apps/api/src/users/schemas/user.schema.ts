import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  gymId: string; // e.g., GYM001

  @Prop({ required: true })
  name: string; // Full name

  @Prop({ required: true })
  passwordHash: string; // Hashed password (bcrypt)

  @Prop({ required: true, enum: ['admin', 'trainer', 'member'] })
  role: 'admin' | 'trainer' | 'member';

  @Prop({ enum: ['Basic', 'Premium', 'VIP'], default: 'Basic' })
  membershipType: 'Basic' | 'Premium' | 'VIP';

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  profileImageUrl?: string; // Cloudinary link (optional)

  @Prop({ type: [String], default: [] })
  achievements?: string[]; // e.g. ["Lost 10kg", "Completed 30 classes"]

  @Prop({ type: [String], default: [] })
  favoriteWorkouts?: string[]; // e.g. ["Chest Day", "HIIT"]

  @Prop({ default: Date.now })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add performance indexes
UserSchema.index({ gymId: 1 }); // Unique index for login lookups
UserSchema.index({ role: 1 }); // For role-based queries
UserSchema.index({ membershipType: 1 }); // For membership filtering
UserSchema.index({ createdAt: -1 }); // For user registration analytics
