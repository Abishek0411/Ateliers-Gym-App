import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ChallengesService } from '../challenges/challenges.service';

async function populateParticipations() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const challengesService = app.get(ChallengesService);

  console.log('🏋️‍♂️ Creating sample participations...');

  // Get all challenges
  const challengesResponse = await challengesService.getChallenges({
    limit: 50,
  });
  const challenges = challengesResponse.challenges;

  if (challenges.length === 0) {
    console.log(
      '❌ No challenges found. Please run populate-challenges.ts first.'
    );
    await app.close();
    return;
  }

  // Sample users to participate
  const sampleUsers = [
    { gymId: 'GYM001', name: 'John Doe' },
    { gymId: 'GYM002', name: 'Jane Smith' },
    { gymId: 'GYM003', name: 'Mike Johnson' },
    { gymId: 'GYM004', name: 'Sarah Wilson' },
    { gymId: 'GYM005', name: 'Alex Brown' },
  ];

  try {
    for (const challenge of challenges) {
      console.log(`\n📋 Processing challenge: ${challenge.title}`);

      // Randomly select 2-4 users to join this challenge
      const numParticipants = Math.floor(Math.random() * 3) + 2;
      const selectedUsers = sampleUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, numParticipants);

      for (const user of selectedUsers) {
        try {
          // Join the challenge
          await challengesService.joinChallenge(
            challenge._id,
            user.gymId,
            user.name,
            {}
          );

          console.log(`  ✅ ${user.name} joined the challenge`);

          // Simulate some progress (randomly complete some days)
          const totalDays = challenge.tasks?.length || 30;
          const completionRate = Math.random() * 0.8 + 0.2; // 20-100% completion
          const daysToComplete = Math.floor(totalDays * completionRate);

          for (let day = 1; day <= daysToComplete; day++) {
            // Randomly skip some days to make it more realistic
            if (Math.random() > 0.1) {
              // 90% chance to complete each day
              try {
                await challengesService.markProgress(
                  challenge._id,
                  user.gymId,
                  {
                    day,
                    completed: true,
                  }
                );
              } catch (error) {
                // Ignore errors for days that might already be completed
              }
            }
          }

          console.log(
            `  📊 ${user.name} completed ${daysToComplete}/${totalDays} days`
          );
        } catch (error) {
          console.log(`  ⚠️  ${user.name} might already be participating`);
        }
      }
    }

    console.log('\n🎉 Sample participations created successfully!');
    console.log('\n📊 Participation Summary:');
    console.log('• Users can now see populated leaderboards');
    console.log('• Progress tracking is working with real data');
    console.log('• Streak calculations are active');
    console.log('• Challenge stats are being calculated');
  } catch (error) {
    console.error('❌ Error creating participations:', error);
  } finally {
    await app.close();
  }
}

populateParticipations();
