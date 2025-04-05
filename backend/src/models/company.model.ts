import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  address: string;
  nif: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    iban?: string;
  };
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
    nif: {
      type: String,
      required: [true, 'NIF is required'],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    website: {
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Please enter a valid URL'],
    },
    logo: {
      type: String,
      trim: true,
    },
    bankDetails: {
      bankName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      iban: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
companySchema.index({ nif: 1 }, { unique: true });

export const Company = mongoose.model<ICompany>('Company', companySchema); 