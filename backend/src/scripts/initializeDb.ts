import mongoose from 'mongoose';
import User from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const initializeDb = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockhr';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if we have any users
    const usersCount = await User.countDocuments();
    
    if (usersCount === 0) {
      console.log('No users found. Creating superadmin...');

      // Create superadmin user
      const superAdmin = await User.create({
        email: 'admin@stockhr.com',
        password: 'admin123',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'superadmin',
        active: true,
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: true,
          twoFactorEnabled: false
        }
      });

      console.log('Superadmin created successfully');
      console.log('Email: admin@stockhr.com');
      console.log('Password: admin123');
    } else {
      console.log(`Database already has ${usersCount} users. No initialization needed.`);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeDb(); 