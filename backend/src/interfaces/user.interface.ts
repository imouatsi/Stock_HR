import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password?: string;
  role: string;
  isAuthorized: boolean;
  isActive: boolean;
  passwordChangedAt?: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
} 