import mongoose from 'mongoose';
import { User } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stockhr');
    
    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Superadmin already exists');
      process.exit(0);
    }

    // Create superadmin user
    const superAdmin = await User.create({
      email: 'superadmin@stockhr.com',
      password: 'SuperAdmin123!',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superadmin',
      isActive: true,
    });

    console.log('Superadmin created successfully:', superAdmin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error);
    process.exit(1);
  }
};

createSuperAdmin(); 