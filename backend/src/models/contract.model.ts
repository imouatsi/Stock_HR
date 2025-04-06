import mongoose from 'mongoose';
import { IContract } from '../interfaces/contract.interface';

const contractSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'Contract number is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Contract name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Contract description is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  amount: {
    type: Number,
    required: [true, 'Contract amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated'],
    default: 'active'
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  }
}, {
  timestamps: true
});

export const Contract = mongoose.model<IContract>('Contract', contractSchema); 