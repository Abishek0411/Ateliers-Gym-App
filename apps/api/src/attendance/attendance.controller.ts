import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { AttendanceStatsDto } from './dto/attendance-stats.dto';
import { User } from '../auth/interfaces/user.interface';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('checkin')
  async checkIn(
    @Body() checkInDto: CheckInDto,
    @Request() req: { user: User }
  ) {
    const user = req.user as User;
    return this.attendanceService.checkIn(user.gymId, checkInDto);
  }

  @Get('user/:userId')
  async getAttendanceStats(
    @Param('userId') userId: string,
    @Request() req: { user: User },
    @Query('month') month?: string
  ): Promise<AttendanceStatsDto> {
    const currentUser = req.user as User;

    // Users can only view their own attendance, or trainers/admins can view any
    if (
      userId !== currentUser.gymId &&
      currentUser.role !== 'trainer' &&
      currentUser.role !== 'admin'
    ) {
      throw new ForbiddenException('You can only view your own attendance');
    }

    return this.attendanceService.getAttendanceStats(userId, month);
  }

  @Post('checkin/:userId')
  async manualCheckIn(
    @Param('userId') userId: string,
    @Body() checkInDto: CheckInDto,
    @Request() req: { user: User }
  ) {
    const currentUser = req.user as User;

    // Only trainers and admins can do manual check-ins
    if (currentUser.role !== 'trainer' && currentUser.role !== 'admin') {
      throw new ForbiddenException(
        'Only trainers and admins can perform manual check-ins'
      );
    }

    // Set manual flag
    checkInDto.isManual = true;

    return this.attendanceService.checkIn(userId, checkInDto);
  }
}
