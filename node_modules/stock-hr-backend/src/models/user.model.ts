import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, PERMISSIONS } from '../../../shared/config';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: keyof typeof ROLES;
  permissions: Array<keyof typeof PERMISSIONS>;
  active: boolean;
  lastLogin?: Date;
  phoneNumber?: string;
  avatar?: string;
  preferences: {
    language: 'en' | 'fr' | 'ar';
    theme: 'light' | 'dark';
    notifications: boolean;
    twoFactorEnabled: boolean;
  };
  securityQuestions?: Array<{
    question: string;
    answer: string;
  }>;
  loginAttempts: number;
  lockUntil?: Date;
  webauthnKeys?: Array<{
    credentialId: string;
    publicKey: string;
    counter: number;
  }>;
  sessions: Array<{
    token: string;
    device: string;
    ip: string;
    lastUsed: Date;
    expiresAt: Date;
    location?: {
      country: string;
      city: string;
      coordinates: [number, number]
    };
    userAgent: string;
  }>;
  mfa: {
    enabled: boolean;
    secret?: string;
    backupCodes: string[];
    recoveryEmail?: string;
  };
  auditLog: Array<{
    action: string;
    timestamp: Date;
    ip: string;
    userAgent: string;
    details: Record<string, any>;
  }>;
  settings: {
    emailNotifications: {
      security: boolean;
      updates: boolean;
      marketing: boolean;
    };
    accessibility: {
      fontSize: 'small' | 'medium' | 'large';
      contrast: 'normal' | 'high';
      animations: boolean;
    };
    workspace: {
      defaultView: 'grid' | 'list';
      defaultLanguage: 'en' | 'fr' | 'ar';
      startPage: string;
      recentItems: string[];
      favorites: string[];
      customShortcuts: Array<{
        name: string;
        path: string;
        icon: string;
      }>;
    };
  };
  organization?: mongoose.Types.ObjectId;
  supervisor?: mongoose.Types.ObjectId;
  department?: string;
  position?: string;
  employmentDate?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
  },
  role: {
    type: String,
    enum: Object.keys(ROLES) as Array<keyof typeof ROLES>,
    default: 'SELLER',
  },
  permissions: [{
    type: String,
    enum: Object.keys(PERMISSIONS) as Array<keyof typeof PERMISSIONS>,
  }],
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  lastLogin: Date,
  phoneNumber: String,
  avatar: String,
  preferences: {
    language: {
      type: String,
      enum: ['en', 'fr', 'ar'],
      default: 'en',
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  securityQuestions: [{
    question: String,
    answer: String,
  }],
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  lockUntil: Date,
  webauthnKeys: [{
    credentialId: String,
    publicKey: String,
    counter: Number,
  }],
  sessions: [{
    token: String,
    device: String,
    ip: String,
    lastUsed: Date,
    expiresAt: Date,
    location: {
      country: String,
      city: String,
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    userAgent: String,
  }],
  mfa: {
    enabled: {
      type: Boolean,
      default: false,
    },
    secret: String,
    backupCodes: [String],
    recoveryEmail: String,
  },
  auditLog: [{
    action: String,
    timestamp: Date,
    ip: String,
    userAgent: String,
    details: Schema.Types.Mixed,
  }],
  settings: {
    emailNotifications: {
      security: {
        type: Boolean,
        default: true,
      },
      updates: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
    },
    accessibility: {
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium',
      },
      contrast: {
        type: String,
        enum: ['normal', 'high'],
        default: 'normal',
      },
      animations: {
        type: Boolean,
        default: true,
      },
    },
    workspace: {
      defaultView: {
        type: String,
        enum: ['grid', 'list'],
        default: 'grid',
      },
      defaultLanguage: {
        type: String,
        enum: ['en', 'fr', 'ar'],
        default: 'en',
      },
      startPage: String,
      recentItems: [String],
      favorites: [String],
      customShortcuts: [{
        name: String,
        path: String,
        icon: String,
      }],
    },
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  department: String,
  position: String,
  employmentDate: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incLoginAttempts = async function(): Promise<void> {
  this.loginAttempts += 1;
  await this.save();
};

userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

export const User = mongoose.model<IUser>('User', userSchema);