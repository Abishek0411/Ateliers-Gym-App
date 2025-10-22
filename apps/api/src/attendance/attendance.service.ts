import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import { CheckInDto } from './dto/check-in.dto';
import { AttendanceStatsDto } from './dto/attendance-stats.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>
  ) {}

  async checkIn(userId: string, checkInDto: CheckInDto): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user already checked in today
    const existingCheckIn = await this.attendanceModel.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingCheckIn) {
      throw new ConflictException('Already checked in today');
    }

    const attendance = new this.attendanceModel({
      userId,
      date: checkInDto.date || today,
      checkInTime: new Date(),
      isManual: checkInDto.isManual || false,
      notes: checkInDto.notes,
    });

    return await attendance.save();
  }

  async getAttendanceStats(
    userId: string,
    month?: string
  ): Promise<AttendanceStatsDto> {
    let startDate: Date;
    let endDate: Date;

    if (month) {
      // Parse month in YYYY-MM format
      const [year, monthNum] = month.split('-').map(Number);
      if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
        throw new BadRequestException('Invalid month format. Use YYYY-MM');
      }

      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }

    // Get all attendance records for the user in the date range
    const attendances = await this.attendanceModel
      .find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: 1 })
      .exec();

    const checkedInDates = attendances.map(
      attendance => attendance.date.toISOString().split('T')[0]
    );

    // Calculate streaks
    const { currentStreak, longestStreak } = this.calculateStreaks(attendances);

    return {
      checkedInDates,
      currentStreak,
      longestStreak,
      monthlyCount: attendances.length,
    };
  }

  private calculateStreaks(attendances: AttendanceDocument[]): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (attendances.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort by date (most recent first)
    const sortedDates = attendances
      .map(att => att.date)
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak (from today backwards)
    const checkDate = new Date(today);

    for (let i = 0; i < sortedDates.length; i++) {
      const attendanceDate = new Date(sortedDates[i]);
      attendanceDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);

      if (attendanceDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);

      const daysDiff = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }

  async getAllUserAttendance(userId: string): Promise<Attendance[]> {
    return await this.attendanceModel
      .find({ userId })
      .sort({ date: -1 })
      .exec();
  }

  async deleteAttendance(attendanceId: string, userId: string): Promise<void> {
    const attendance = await this.attendanceModel.findOne({
      _id: attendanceId,
      userId,
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    await this.attendanceModel.findByIdAndDelete(attendanceId);
  }
}
