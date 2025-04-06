import mongoose from 'mongoose';
import { config } from '../config';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database.uri);
    console.log('Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email: 'superadmin@stockhr.com' }).select('+password +active');
    
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', {
      email: user.email,
      role: user.role,
      active: user.active,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    });

    // Test password
    const testPassword = 'SuperAdmin123!';
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('Password test:', {
      testPassword,
      isPasswordValid,
      storedPasswordHash: user.password
    });

    // Create a new hash for comparison
    const newHash = await bcrypt.hash(testPassword, 12);
    console.log('New hash test:', {
      newHash,
      storedHash: user.password,
      hashesMatch: newHash === user.password
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testLogin(); 