import mongoose from 'mongoose';
import User from '../models/user.model';
import { config } from '../config';

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database.url);
    console.log('Connected to MongoDB');

    // Check if users already exist
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`${userCount} users already exist in the database. Skipping user seeding.`);
    } else {
      // Create test users
      const users = [
        {
          username: 'admin',
          password: 'password123',
          role: 'admin',
          isAuthorized: true,
          isActive: true
        },
        {
          username: 'superadmin',
          password: 'password123',
          role: 'superadmin',
          isAuthorized: true,
          isActive: true
        },
        {
          username: 'user',
          password: 'password123',
          role: 'user',
          isAuthorized: true,
          isActive: true
        }
      ];

      await User.create(users);
      console.log('Test users created successfully');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

// Run the seed function
seedUsers();
