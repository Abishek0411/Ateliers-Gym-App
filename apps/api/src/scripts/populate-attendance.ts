import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AttendanceService } from '../attendance/attendance.service';

async function populateAttendanceData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const attendanceService = app.get(AttendanceService);

  // Sample user IDs (you can get these from your users collection)
  const userIds = ['GYM001', 'GYM002', 'GYM003']; // Replace with actual user IDs

  console.log('Adding sample attendance data...');

  for (const userId of userIds) {
    try {
      // Add check-ins for the past 30 days (some consecutive, some scattered)
      const today = new Date();

      // Add check-ins for the last 7 days (consecutive streak)
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        await attendanceService.checkIn(userId, {
          date: date.toISOString().split('T')[0],
          isManual: true,
          notes: `Sample check-in for ${date.toISOString().split('T')[0]}`,
        });
        console.log(
          `Added check-in for ${userId} on ${date.toISOString().split('T')[0]}`
        );
      }

      // Add some scattered check-ins from 2 weeks ago
      for (let i = 14; i < 21; i += 2) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        await attendanceService.checkIn(userId, {
          date: date.toISOString().split('T')[0],
          isManual: true,
          notes: `Sample check-in for ${date.toISOString().split('T')[0]}`,
        });
        console.log(
          `Added check-in for ${userId} on ${date.toISOString().split('T')[0]}`
        );
      }
    } catch (error) {
      console.log(
        `Error adding attendance for ${userId}:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  console.log('Sample attendance data added successfully!');
  await app.close();
}

populateAttendanceData().catch(console.error);
