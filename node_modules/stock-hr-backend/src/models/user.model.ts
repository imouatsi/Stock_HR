import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  isAuthorized: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  passwordChangedAt: Date,
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  try {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User; 