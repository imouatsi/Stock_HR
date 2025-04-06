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
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isAuthorized: boolean;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  settings: {
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
  organization?: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      match: [/^(SA|UA|U)\d{5}$/, 'Invalid username format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
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
    isAuthorized: {
      type: Boolean,
      default: false
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
    lastLogin: {
      type: Date
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    settings: {
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
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
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
    typedLogger.error('Error comparing passwords:', { error });
    return false;
  }
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  try {
    // If lockUntil is set and it's expired, reset login attempts
    if (this.lockUntil && this.lockUntil < new Date()) {
      this.loginAttempts = 1;
      this.lockUntil = undefined;
    } else {
      this.loginAttempts += 1;
      
      // Lock account if max attempts reached
      if (this.loginAttempts >= 5) {
        this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }
    }
    await this.save();
  } catch (error) {
    typedLogger.error('Error incrementing login attempts:', { error });
    throw error;
  }
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  try {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    await this.save();
  } catch (error) {
    typedLogger.error('Error resetting login attempts:', { error });
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);