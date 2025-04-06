import mongoose from 'mongoose';
import { config } from '../config';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(config.database.uri);
    console.log('Connected to MongoDB');

    const superadminEmail = 'superadmin@stockhr.com';
    const superadminPassword = 'SuperAdmin123!';

    // Check if superadmin exists
    const existingSuperadmin = await User.findOne({ email: superadminEmail }).select('+active +password');
    
    if (existingSuperadmin) {
      console.log('Updating existing superadmin user...');
      // Update existing superadmin
      const hashedPassword = await bcrypt.hash(superadminPassword, 12);
      existingSuperadmin.password = hashedPassword;
      existingSuperadmin.active = true;
      existingSuperadmin.role = 'SUPERADMIN';
      await existingSuperadmin.save({ validateBeforeSave: false });
      console.log('Superadmin user updated successfully');
    } else {
      console.log('Creating new superadmin user...');
      // Create new superadmin
      const hashedPassword = await bcrypt.hash(superadminPassword, 12);
      await User.create({
        email: superadminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN',
        active: true,
        permissions: ['ALL'],
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: true,
          twoFactorEnabled: false
        },
        loginAttempts: 0,
        sessions: [],
        mfa: {
          enabled: false,
          backupCodes: []
        },
        auditLog: [],
        settings: {
          emailNotifications: {
            security: true,
            updates: true,
            marketing: false
          },
          accessibility: {
            fontSize: 'medium',
            contrast: 'normal',
            animations: true
          },
          workspace: {
            defaultView: 'grid',
            defaultLanguage: 'en',
            startPage: 'dashboard',
            recentItems: [],
            favorites: [],
            customShortcuts: []
          }
        }
      });
      console.log('Superadmin user created successfully');
    }

    // Verify the user was created/updated correctly
    const verifiedUser = await User.findOne({ email: superadminEmail }).select('+active +password');
    console.log('Verified user:', {
      email: verifiedUser?.email,
      role: verifiedUser?.role,
      active: verifiedUser?.active,
      hasPassword: !!verifiedUser?.password,
      password: verifiedUser?.password ? '[HIDDEN]' : undefined
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createSuperAdmin(); 