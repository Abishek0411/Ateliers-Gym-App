import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop({ default: Date.now })
  checkInTime: Date;

  @Prop({ default: false })
  isManual: boolean; // For trainer/admin manual check-ins

  @Prop()
  notes?: string; // Optional notes for manual check-ins
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Compound index for efficient queries
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
// Index for date range queries
AttendanceSchema.index({ date: -1 });
