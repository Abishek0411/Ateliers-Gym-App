import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AttendanceService } from '../attendance/attendance.service';

async function populateGYM003Extensive() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const attendanceService = app.get(AttendanceService);

  const userId = 'GYM003';

  console.log('Adding extensive sample attendance data for GYM003...');

  try {
    const today = new Date();

    // Add data for the last 3 months
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() - monthOffset,
        1
      );
      const year = targetMonth.getFullYear();
      const month = targetMonth.getMonth();

      console.log(
        `Adding data for ${year}-${String(month + 1).padStart(2, '0')}`
      );

      // Add 15-20 check-ins per month (3-4 per week)
      for (let week = 0; week < 4; week++) {
        for (let day = 0; day < 4; day++) {
          const checkInDate = new Date(year, month, week * 7 + day * 2 + 1);

          // Skip if date is in the future
          if (checkInDate > today) continue;

          try {
            await attendanceService.checkIn(userId, {
              date: checkInDate.toISOString().split('T')[0],
              isManual: true,
              notes: `Sample check-in for ${checkInDate.toISOString().split('T')[0]}`,
            });
            console.log(
              `Added check-in for ${userId} on ${checkInDate.toISOString().split('T')[0]}`
            );
          } catch (error) {
            console.log(
              `Check-in already exists for ${checkInDate.toISOString().split('T')[0]}`
            );
          }
        }
      }
    }

    // Add some consecutive streaks for different months
    const streaks = [
      { month: -1, days: [1, 2, 3, 4, 5] }, // 5-day streak last month
      { month: -2, days: [10, 11, 12, 13, 14, 15, 16] }, // 7-day streak 2 months ago
      { month: -3, days: [5, 6, 7, 8, 9] }, // 5-day streak 3 months ago
    ];

    for (const streak of streaks) {
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() + streak.month,
        1
      );
      const year = targetMonth.getFullYear();
      const month = targetMonth.getMonth();

      for (const day of streak.days) {
        const checkInDate = new Date(year, month, day);

        // Skip if date is in the future
        if (checkInDate > today) continue;

        try {
          await attendanceService.checkIn(userId, {
            date: checkInDate.toISOString().split('T')[0],
            isManual: true,
            notes: `Streak check-in for ${checkInDate.toISOString().split('T')[0]}`,
          });
          console.log(
            `Added streak check-in for ${userId} on ${checkInDate.toISOString().split('T')[0]}`
          );
        } catch (error) {
          console.log(
            `Check-in already exists for ${checkInDate.toISOString().split('T')[0]}`
          );
        }
      }
    }
  } catch (error) {
    console.log(
      `Error adding attendance for ${userId}:`,
      error instanceof Error ? error.message : String(error)
    );
  }

  console.log(
    'Extensive sample attendance data added successfully for GYM003!'
  );
  await app.close();
}

populateGYM003Extensive().catch(console.error);
