import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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

  // Profile completion fields
  @Prop()
  dob?: Date; // Date of birth

  @Prop({ enum: ['male', 'female', 'other'] })
  gender?: 'male' | 'female' | 'other';

  @Prop({ min: 50, max: 250 })
  heightCm?: number; // Height in centimeters

  @Prop({ min: 20, max: 300 })
  weightKg?: number; // Weight in kilograms

  @Prop({
    enum: [
      'lose_weight',
      'gain_muscle',
      'maintain',
      'performance',
      'general_fitness',
    ],
  })
  goal?:
    | 'lose_weight'
    | 'gain_muscle'
    | 'maintain'
    | 'performance'
    | 'general_fitness';

  @Prop()
  preferredTrainerId?: string; // gymId of preferred trainer

  @Prop({
    type: {
      name: { type: String },
      phone: { type: String },
    },
  })
  emergencyContact?: {
    name?: string;
    phone?: string;
  };

  @Prop({
    type: {
      url: { type: String, required: true },
      publicId: { type: String },
    },
  })
  profileImage?: {
    url: string;
    publicId?: string;
  };

  @Prop({
    type: [
      {
        date: { type: Date, default: Date.now },
        weightKg: { type: Number, min: 20, max: 300 },
        chestCm: { type: Number, min: 50, max: 200 },
        waistCm: { type: Number, min: 50, max: 200 },
        hipsCm: { type: Number, min: 50, max: 200 },
        notes: { type: String },
      },
    ],
    default: [],
  })
  measurements?: Array<{
    _id?: MongooseSchema.Types.ObjectId;
    date: Date;
    weightKg?: number;
    chestCm?: number;
    waistCm?: number;
    hipsCm?: number;
    notes?: string;
  }>;

  @Prop({ default: false })
  isProfileComplete?: boolean; // Flag to track if profile is complete
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add performance indexes
UserSchema.index({ gymId: 1 }); // Unique index for login lookups
UserSchema.index({ role: 1 }); // For role-based queries
UserSchema.index({ membershipType: 1 }); // For membership filtering
UserSchema.index({ createdAt: -1 }); // For user registration analytics
