import mongoose from 'mongoose';
import { ILicense } from '../interfaces/license.interface';

const licenseSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'License name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'License description is required']
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
    required: [true, 'License amount is required'],
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

export const License = mongoose.model<ILicense>('License', licenseSchema); 