import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ChallengesService } from '../challenges/challenges.service';

async function populateChallenges() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const challengesService = app.get(ChallengesService);

  console.log('🏋️‍♂️ Creating sample challenges...');

  const sampleChallenges = [
    {
      title: '30-Day Push-Up Challenge',
      description:
        'Build upper body strength with daily push-up progressions. Start with 10 and work your way up to 100!',
      type: 'daily' as const,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      tasks: [
        { day: 1, task: 'Do 10 push-ups' },
        { day: 2, task: 'Do 12 push-ups' },
        { day: 3, task: 'Do 15 push-ups' },
        { day: 4, task: 'Do 18 push-ups' },
        { day: 5, task: 'Do 20 push-ups' },
        { day: 6, task: 'Do 25 push-ups' },
        { day: 7, task: 'Do 30 push-ups' },
        { day: 8, task: 'Do 35 push-ups' },
        { day: 9, task: 'Do 40 push-ups' },
        { day: 10, task: 'Do 45 push-ups' },
        { day: 11, task: 'Do 50 push-ups' },
        { day: 12, task: 'Do 55 push-ups' },
        { day: 13, task: 'Do 60 push-ups' },
        { day: 14, task: 'Do 65 push-ups' },
        { day: 15, task: 'Do 70 push-ups' },
        { day: 16, task: 'Do 75 push-ups' },
        { day: 17, task: 'Do 80 push-ups' },
        { day: 18, task: 'Do 85 push-ups' },
        { day: 19, task: 'Do 90 push-ups' },
        { day: 20, task: 'Do 95 push-ups' },
        { day: 21, task: 'Do 100 push-ups' },
        { day: 22, task: 'Do 105 push-ups' },
        { day: 23, task: 'Do 110 push-ups' },
        { day: 24, task: 'Do 115 push-ups' },
        { day: 25, task: 'Do 120 push-ups' },
        { day: 26, task: 'Do 125 push-ups' },
        { day: 27, task: 'Do 130 push-ups' },
        { day: 28, task: 'Do 135 push-ups' },
        { day: 29, task: 'Do 140 push-ups' },
        { day: 30, task: 'Do 150 push-ups - FINAL BOSS!' },
      ],
      tags: ['strength', 'upper-body', '30-day', 'beginner'],
      isActive: true,
    },
    {
      title: '7-Day Cardio Streak',
      description:
        'Keep your heart pumping with daily cardio sessions. Maintain the streak for maximum benefits!',
      type: 'streak' as const,
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      tasks: [
        { day: 1, task: '20 minutes of cardio' },
        { day: 2, task: '25 minutes of cardio' },
        { day: 3, task: '30 minutes of cardio' },
        { day: 4, task: '35 minutes of cardio' },
        { day: 5, task: '40 minutes of cardio' },
        { day: 6, task: '45 minutes of cardio' },
        { day: 7, task: '50 minutes of cardio - STREAK COMPLETE!' },
      ],
      tags: ['cardio', 'streak', '7-day', 'intermediate'],
      isActive: true,
    },
    {
      title: 'Plank Master Challenge',
      description:
        'Master the plank and build core strength. Perfect your form and increase your hold time!',
      type: 'task' as const,
      startDate: '2024-02-01',
      endDate: '2024-02-14',
      tasks: [
        { day: 1, task: 'Hold plank for 30 seconds' },
        { day: 2, task: 'Hold plank for 45 seconds' },
        { day: 3, task: 'Hold plank for 1 minute' },
        { day: 4, task: 'Hold plank for 1 minute 15 seconds' },
        { day: 5, task: 'Hold plank for 1 minute 30 seconds' },
        { day: 6, task: 'Hold plank for 1 minute 45 seconds' },
        { day: 7, task: 'Hold plank for 2 minutes' },
        { day: 8, task: 'Hold plank for 2 minutes 15 seconds' },
        { day: 9, task: 'Hold plank for 2 minutes 30 seconds' },
        { day: 10, task: 'Hold plank for 2 minutes 45 seconds' },
        { day: 11, task: 'Hold plank for 3 minutes' },
        { day: 12, task: 'Hold plank for 3 minutes 15 seconds' },
        { day: 13, task: 'Hold plank for 3 minutes 30 seconds' },
        { day: 14, task: 'Hold plank for 4 minutes - PLANK MASTER!' },
      ],
      tags: ['core', 'strength', 'plank', '14-day', 'advanced'],
      isActive: true,
    },
    {
      title: 'Squat Challenge',
      description:
        'Build leg strength and endurance with progressive squat challenges. Feel the burn!',
      type: 'daily' as const,
      startDate: '2024-02-15',
      endDate: '2024-02-29',
      tasks: [
        { day: 1, task: 'Do 20 squats' },
        { day: 2, task: 'Do 25 squats' },
        { day: 3, task: 'Do 30 squats' },
        { day: 4, task: 'Do 35 squats' },
        { day: 5, task: 'Do 40 squats' },
        { day: 6, task: 'Do 45 squats' },
        { day: 7, task: 'Do 50 squats' },
        { day: 8, task: 'Do 55 squats' },
        { day: 9, task: 'Do 60 squats' },
        { day: 10, task: 'Do 65 squats' },
        { day: 11, task: 'Do 70 squats' },
        { day: 12, task: 'Do 75 squats' },
        { day: 13, task: 'Do 80 squats' },
        { day: 14, task: 'Do 85 squats' },
        { day: 15, task: 'Do 90 squats' },
        { day: 16, task: 'Do 95 squats' },
        { day: 17, task: 'Do 100 squats' },
        { day: 18, task: 'Do 105 squats' },
        { day: 19, task: 'Do 110 squats' },
        { day: 20, task: 'Do 115 squats' },
        { day: 21, task: 'Do 120 squats' },
        { day: 22, task: 'Do 125 squats' },
        { day: 23, task: 'Do 130 squats' },
        { day: 24, task: 'Do 135 squats' },
        { day: 25, task: 'Do 140 squats' },
        { day: 26, task: 'Do 145 squats' },
        { day: 27, task: 'Do 150 squats' },
        { day: 28, task: 'Do 155 squats' },
        { day: 29, task: 'Do 160 squats' },
        { day: 30, task: 'Do 200 squats - LEG DAY CHAMPION!' },
      ],
      tags: ['legs', 'strength', 'endurance', '30-day', 'intermediate'],
      isActive: true,
    },
    {
      title: 'Morning Routine Streak',
      description:
        'Start your day right with a consistent morning fitness routine. Build healthy habits!',
      type: 'streak' as const,
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      tasks: [
        { day: 1, task: 'Morning stretch routine (10 min)' },
        { day: 2, task: 'Morning stretch routine (10 min)' },
        { day: 3, task: 'Morning stretch routine (10 min)' },
        { day: 4, task: 'Morning stretch routine (10 min)' },
        { day: 5, task: 'Morning stretch routine (10 min)' },
        { day: 6, task: 'Morning stretch routine (10 min)' },
        { day: 7, task: 'Morning stretch routine (10 min)' },
        { day: 8, task: 'Morning stretch routine (10 min)' },
        { day: 9, task: 'Morning stretch routine (10 min)' },
        { day: 10, task: 'Morning stretch routine (10 min)' },
        { day: 11, task: 'Morning stretch routine (10 min)' },
        { day: 12, task: 'Morning stretch routine (10 min)' },
        { day: 13, task: 'Morning stretch routine (10 min)' },
        { day: 14, task: 'Morning stretch routine (10 min)' },
        { day: 15, task: 'Morning stretch routine (10 min)' },
        { day: 16, task: 'Morning stretch routine (10 min)' },
        { day: 17, task: 'Morning stretch routine (10 min)' },
        { day: 18, task: 'Morning stretch routine (10 min)' },
        { day: 19, task: 'Morning stretch routine (10 min)' },
        { day: 20, task: 'Morning stretch routine (10 min)' },
        { day: 21, task: 'Morning stretch routine (10 min)' },
        { day: 22, task: 'Morning stretch routine (10 min)' },
        { day: 23, task: 'Morning stretch routine (10 min)' },
        { day: 24, task: 'Morning stretch routine (10 min)' },
        { day: 25, task: 'Morning stretch routine (10 min)' },
        { day: 26, task: 'Morning stretch routine (10 min)' },
        { day: 27, task: 'Morning stretch routine (10 min)' },
        { day: 28, task: 'Morning stretch routine (10 min)' },
        { day: 29, task: 'Morning stretch routine (10 min)' },
        { day: 30, task: 'Morning stretch routine (10 min)' },
        { day: 31, task: 'Morning stretch routine (10 min) - HABIT MASTER!' },
      ],
      tags: ['morning', 'routine', 'streak', '31-day', 'beginner'],
      isActive: true,
    },
  ];

  try {
    for (const challengeData of sampleChallenges) {
      const challenge = await challengesService.createChallenge(challengeData);
      console.log(`✅ Created challenge: ${challenge.title}`);
    }

    console.log('\n🎉 Sample challenges created successfully!');
    console.log('\n📋 Challenge Summary:');
    console.log('• 30-Day Push-Up Challenge (Daily)');
    console.log('• 7-Day Cardio Streak (Streak)');
    console.log('• Plank Master Challenge (Task)');
    console.log('• Squat Challenge (Daily)');
    console.log('• Morning Routine Streak (Streak)');

    console.log('\n🚀 Users can now:');
    console.log('• Browse challenges at /challenges');
    console.log('• Join challenges and track progress');
    console.log('• View leaderboards and compete');
    console.log('• Mark daily progress and build streaks');
  } catch (error) {
    console.error('❌ Error creating challenges:', error);
  } finally {
    await app.close();
  }
}

populateChallenges();
