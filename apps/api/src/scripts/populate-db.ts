import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../community/schemas/post.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

async function populateDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const postModel = app.get<Model<PostDocument>>(getModelToken(Post.name));
    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

    console.log('🌱 Starting database population...');

    // Clear existing data
    await postModel.deleteMany({});
    await userModel.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample users
    const users = [
      {
        gymId: 'GYM001',
        name: 'Priya Sharma',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'trainer',
        membershipType: 'Premium',
        email: 'priya@ateliers.com',
        phone: '+91-9876543210',
        achievements: [
          'Certified Personal Trainer',
          'Yoga Instructor',
          '5+ Years Experience',
        ],
        favoriteWorkouts: ['Yoga', 'HIIT', 'Strength Training'],
        lastLogin: new Date(),
      },
      {
        gymId: 'GYM002',
        name: 'Rajesh Kumar',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'admin',
        membershipType: 'VIP',
        email: 'rajesh@ateliers.com',
        phone: '+91-9876543211',
        achievements: ['Mr. India 2019', 'IFBB Pro', '10+ Years Experience'],
        favoriteWorkouts: ['Bodybuilding', 'Powerlifting', 'Nutrition'],
        lastLogin: new Date(),
      },
      {
        gymId: 'GYM003',
        name: 'Amit Singh',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'member',
        membershipType: 'Basic',
        email: 'amit@example.com',
        phone: '+91-9876543212',
        achievements: ['Lost 15kg', 'Completed 30 classes'],
        favoriteWorkouts: ['Cardio', 'Weight Training'],
        lastLogin: new Date(),
      },
      {
        gymId: 'GYM004',
        name: 'Sarah Johnson',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'member',
        membershipType: 'Premium',
        email: 'sarah@example.com',
        phone: '+91-9876543213',
        achievements: ['Lost 25kg in 6 months', 'Completed first marathon'],
        favoriteWorkouts: ['Running', 'Pilates', 'Swimming'],
        lastLogin: new Date(),
      },
      {
        gymId: 'GYM005',
        name: 'Mike Chen',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'member',
        membershipType: 'VIP',
        email: 'mike@example.com',
        phone: '+91-9876543214',
        achievements: [
          'Gained 15kg muscle in 8 months',
          'Powerlifting champion',
        ],
        favoriteWorkouts: ['Powerlifting', 'Bodybuilding', 'Olympic Lifting'],
        lastLogin: new Date(),
      },
    ];

    console.log('👥 Creating users...');
    const createdUsers = await userModel.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample posts
    const posts = [
      {
        authorId: 'GYM001',
        authorName: 'Priya Sharma',
        authorRole: 'trainer',
        text: 'Really good session today! Focused on full body strength training with emphasis on proper form. Remember, consistency is key to achieving your fitness goals. Keep pushing yourself! 💪',
        workoutSplit: 'Full Body',
        musclesWorked: [
          'Chest',
          'Back',
          'Shoulders',
          'Biceps',
          'Triceps',
          'Quads',
          'Hamstrings',
        ],
        mediaUrl:
          'https://res.cloudinary.com/dn4qxh5nd/image/upload/v1758894830/ateliers-community/sample-workout-1.jpg',
        mediaType: 'image',
        cloudinaryPublicId: 'ateliers-community/sample-workout-1',
        cloudinaryResourceType: 'image',
        likes: ['GYM002', 'GYM003', 'GYM004'],
        comments: [
          {
            _id: new Types.ObjectId(),
            userId: 'GYM002',
            userName: 'Rajesh Kumar',
            text: 'Great form! Keep it up! 🔥',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            _id: new Types.ObjectId(),
            userId: 'GYM003',
            userName: 'Amit Singh',
            text: 'Inspiring workout! Thanks for the motivation 💪',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        authorId: 'GYM002',
        authorName: 'Rajesh Kumar',
        authorRole: 'admin',
        text: 'Morning powerlifting session complete! Deadlifts, squats, and bench press. The key to progress is progressive overload and proper recovery. Remember to listen to your body! 🏋️‍♂️',
        workoutSplit: 'Pull',
        musclesWorked: ['Back', 'Biceps', 'Hamstrings', 'Glutes', 'Traps'],
        mediaUrl:
          'https://res.cloudinary.com/dn4qxh5nd/image/upload/v1758894830/ateliers-community/sample-powerlifting.jpg',
        mediaType: 'image',
        cloudinaryPublicId: 'ateliers-community/sample-powerlifting',
        cloudinaryResourceType: 'image',
        likes: ['GYM001', 'GYM003', 'GYM005'],
        comments: [
          {
            _id: new Types.ObjectId(),
            userId: 'GYM001',
            userName: 'Priya Sharma',
            text: 'Amazing strength! Your form is perfect 👏',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        authorId: 'GYM003',
        authorName: 'Amit Singh',
        authorRole: 'member',
        text: 'Cardio day complete! 45 minutes of HIIT training. Feeling energized and ready to tackle the day. Small steps lead to big changes! 🏃‍♂️',
        workoutSplit: 'Cardio',
        musclesWorked: ['Core', 'Legs', 'Shoulders'],
        mediaUrl:
          'https://res.cloudinary.com/dn4qxh5nd/image/upload/v1758894830/ateliers-community/sample-cardio.jpg',
        mediaType: 'image',
        cloudinaryPublicId: 'ateliers-community/sample-cardio',
        cloudinaryResourceType: 'image',
        likes: ['GYM001', 'GYM004'],
        comments: [],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        authorId: 'GYM004',
        authorName: 'Sarah Johnson',
        authorRole: 'member',
        text: "Transformation Tuesday! 6 months of consistent training and healthy eating. Lost 25kg and gained so much confidence. Thank you Atelier's for the amazing support! 🙌",
        workoutSplit: 'Other',
        musclesWorked: ['Full Body'],
        mediaUrl:
          'https://res.cloudinary.com/dn4qxh5nd/image/upload/v1758894830/ateliers-community/sample-transformation.jpg',
        mediaType: 'image',
        cloudinaryPublicId: 'ateliers-community/sample-transformation',
        cloudinaryResourceType: 'image',
        likes: ['GYM001', 'GYM002', 'GYM003', 'GYM005'],
        comments: [
          {
            _id: new Types.ObjectId(),
            userId: 'GYM001',
            userName: 'Priya Sharma',
            text: "Incredible transformation! You're an inspiration to everyone! 🌟",
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
          {
            _id: new Types.ObjectId(),
            userId: 'GYM002',
            userName: 'Rajesh Kumar',
            text: 'Outstanding progress! This is what dedication looks like! 💪',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        authorId: 'GYM005',
        authorName: 'Mike Chen',
        authorRole: 'member',
        text: 'Upper body strength training session! Focused on chest, shoulders, and arms. Progressive overload is the key to muscle growth. 8 months of consistent training and the results speak for themselves! 💪',
        workoutSplit: 'Push',
        musclesWorked: ['Chest', 'Shoulders', 'Triceps', 'Core'],
        mediaUrl:
          'https://res.cloudinary.com/dn4qxh5nd/image/upload/v1758894830/ateliers-community/sample-upper-body.jpg',
        mediaType: 'image',
        cloudinaryPublicId: 'ateliers-community/sample-upper-body',
        cloudinaryResourceType: 'image',
        likes: ['GYM001', 'GYM002', 'GYM003'],
        comments: [
          {
            _id: new Types.ObjectId(),
            userId: 'GYM001',
            userName: 'Priya Sharma',
            text: 'Excellent form and great progress! Keep it up! 🔥',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
    ];

    console.log('📝 Creating posts...');
    const createdPosts = await postModel.insertMany(posts);
    console.log(`✅ Created ${createdPosts.length} posts`);

    console.log('🎉 Database population completed successfully!');
    console.log('📊 Sample data created:');
    console.log('   - 5 users with different roles and membership types');
    console.log('   - 5 posts with likes and comments');
    console.log('   - Various workout splits and muscle groups');
    console.log('   - Social interactions (likes and comments)');
    console.log('\n🔑 Login credentials:');
    console.log('   - Priya Sharma (GYM001) - trainer');
    console.log('   - Rajesh Kumar (GYM002) - admin');
    console.log('   - Amit Singh (GYM003) - member');
    console.log('   - Sarah Johnson (GYM004) - member');
    console.log('   - Mike Chen (GYM005) - member');
    console.log('   - Password for all: password123');
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await app.close();
  }
}

// Run the population function
populateDatabase().catch(console.error);
