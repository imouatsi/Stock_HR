import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Company address is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Company phone is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Company email is required'],
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    taxId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
companySchema.index({ nif: 1 }, { unique: true });

export const Company = mongoose.model<ICompany>('Company', companySchema); 