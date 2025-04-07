import mongoose from 'mongoose';
import User from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-hr');

    // Delete existing superadmin if exists
    await User.deleteOne({ username: 'superadmin' });

    // Create superadmin user
    const superadmin = await User.create({
      username: 'superadmin',
      password: 'Admin@123',
      role: 'superadmin',
      isAuthorized: true,
      isActive: true
    });

    console.log('Superadmin user created successfully:');
    console.log('Username: superadmin');
    console.log('Password: Admin@123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating superadmin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createSuperAdmin(); 