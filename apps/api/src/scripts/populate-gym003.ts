import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AttendanceService } from '../attendance/attendance.service';

async function populateGYM003Data() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const attendanceService = app.get(AttendanceService);

  const userId = 'GYM003';

  console.log('Adding sample attendance data for GYM003...');

  try {
    // Add check-ins for the past 30 days with some gaps
    const today = new Date();

    // Add check-ins for the last 5 days (consecutive streak)
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      try {
        await attendanceService.checkIn(userId, {
          date: date.toISOString().split('T')[0],
          isManual: true,
          notes: `Sample check-in for ${date.toISOString().split('T')[0]}`,
        });
        console.log(
          `Added check-in for ${userId} on ${date.toISOString().split('T')[0]}`
        );
      } catch (error) {
        console.log(
          `Check-in already exists for ${date.toISOString().split('T')[0]}`
        );
      }
    }

    // Add some scattered check-ins from 2 weeks ago (longest streak)
    for (let i = 14; i < 21; i += 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      try {
        await attendanceService.checkIn(userId, {
          date: date.toISOString().split('T')[0],
          isManual: true,
          notes: `Sample check-in for ${date.toISOString().split('T')[0]}`,
        });
        console.log(
          `Added check-in for ${userId} on ${date.toISOString().split('T')[0]}`
        );
      } catch (error) {
        console.log(
          `Check-in already exists for ${date.toISOString().split('T')[0]}`
        );
      }
    }

    // Add some check-ins from last month
    for (let i = 30; i < 35; i += 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      try {
        await attendanceService.checkIn(userId, {
          date: date.toISOString().split('T')[0],
          isManual: true,
          notes: `Sample check-in for ${date.toISOString().split('T')[0]}`,
        });
        console.log(
          `Added check-in for ${userId} on ${date.toISOString().split('T')[0]}`
        );
      } catch (error) {
        console.log(
          `Check-in already exists for ${date.toISOString().split('T')[0]}`
        );
      }
    }
  } catch (error) {
    console.log(
      `Error adding attendance for ${userId}:`,
      error instanceof Error ? error.message : String(error)
    );
  }

  console.log('Sample attendance data added successfully for GYM003!');
  await app.close();
}

populateGYM003Data().catch(console.error);
