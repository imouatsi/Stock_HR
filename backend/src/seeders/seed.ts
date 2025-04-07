import mongoose from 'mongoose';
import { config } from '../config';
import { User } from '../models/user.model';

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ username: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Superadmin already exists');
      await mongoose.disconnect();
      return;
    }

    // Create superadmin user
    const superAdmin = await User.create({
      username: 'superadmin',
      password: 'Admin@123', // You should change this password after first login
      role: 'admin',
      isAuthorized: true,
      isActive: true
    });

    console.log('Superadmin created successfully:', superAdmin.username);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding superadmin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedSuperAdmin(); 