import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { config } from '../config';

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(config.database.uri);
    console.log('Connected to MongoDB');

    const superAdmin = await User.findOne({ email: 'superadmin@stockhr.com' });
    
    if (!superAdmin) {
      console.log('Creating superadmin user...');
      await User.create({
        email: 'superadmin@stockhr.com',
        password: 'SuperAdmin123!',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN',
        permissions: ['ALL'],
        active: true
      });
      console.log('Superadmin user created successfully');
    } else {
      console.log('Superadmin user already exists');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createSuperAdmin(); 