import mongoose from 'mongoose';
import { ICompany } from '../interfaces/company.interface';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Company address is required']
  },
  phone: {
    type: String,
    required: [true, 'Company phone number is required']
  },
  email: {
    type: String,
    required: [true, 'Company email is required'],
    unique: true,
    lowercase: true
  },
  taxNumber: {
    type: String,
    required: [true, 'Company tax number is required'],
    unique: true
  }
}, {
  timestamps: true
});

export const Company = mongoose.model<ICompany>('Company', companySchema); 