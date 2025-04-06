import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { typedLogger } from '../utils/logger';

export type UserRole = 
  | 'superadmin' 
  | 'admin' 
  | 'manager' 
  | 'seller' 
  | 'stock_clerk'
  | 'hr_manager'
  | 'accountant'
  | 'stock_manager'
  | 'employee'
  | 'finance_manager';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  settings: {
    emailNotifications: boolean;
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
    accessibility: {
      highContrast: boolean;
      fontSize: 'small' | 'medium' | 'large';
    };
    workspace: {
      defaultView: string;
      sidebarCollapsed: boolean;
    };
  };
  organization: {
    department?: string;
    position?: string;
    employeeId?: string;
    joinDate?: Date;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: [
        'superadmin',
        'admin',
        'manager',
        'seller',
        'stock_clerk',
        'hr_manager',
        'accountant',
        'stock_manager',
        'employee',
        'finance_manager'
      ],
      required: [true, 'Role is required'],
    },
    permissions: [{
      type: String,
      enum: [
        // User Management
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        // Inventory Management
        'inventory:create',
        'inventory:read',
        'inventory:update',
        'inventory:delete',
        // Contract Management
        'contract:create',
        'contract:read',
        'contract:update',
        'contract:delete',
        // Invoice Management
        'invoice:create',
        'invoice:read',
        'invoice:update',
        'invoice:delete',
        // HR Management
        'hr:create',
        'hr:read',
        'hr:update',
        'hr:delete',
        // Accounting Management
        'accounting:create',
        'accounting:read',
        'accounting:update',
        'accounting:delete',
        // Stock Management
        'stock:create',
        'stock:read',
        'stock:update',
        'stock:delete',
        // Finance Management
        'finance:create',
        'finance:read',
        'finance:update',
        'finance:delete',
      ],
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      language: {
        type: String,
        default: 'en',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      accessibility: {
        highContrast: {
          type: Boolean,
          default: false,
        },
        fontSize: {
          type: String,
          enum: ['small', 'medium', 'large'],
          default: 'medium',
        },
      },
      workspace: {
        defaultView: {
          type: String,
          default: 'list',
        },
        sidebarCollapsed: {
          type: Boolean,
          default: false,
        },
      },
    },
    organization: {
      department: String,
      position: String,
      employeeId: String,
      joinDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    typedLogger.error('Error hashing password:', { error });
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    typedLogger.error('Error comparing password:', { error });
    return false;
  }
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  if (this.lockUntil && this.lockUntil > new Date()) {
    return;
  }

  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
  }

  await this.save();
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

export default mongoose.model<IUser>('User', userSchema);