import { Document } from 'mongoose';

export interface IContract extends Document {
  number: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'active' | 'expired' | 'terminated';
  company: string;
  createdAt: Date;
  updatedAt: Date;
} 