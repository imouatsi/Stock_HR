import mongoose, { Schema } from 'mongoose';
import { ISupplier } from '../interfaces/supplier.interface';
import { generateSupplierCode } from '../utils/codeGenerator';

// Schema for localized strings (multi-language support)
const localizedStringSchema = new Schema({
  en: {
    type: String,
    required: [true, 'English name is required'],
    trim: true
  },
  fr: {
    type: String,
    required: [true, 'French name is required'],
    trim: true
  },
  ar: {
    type: String,
    required: [true, 'Arabic name is required'],
    trim: true
  }
}, { _id: false });

const supplierSchema = new Schema<ISupplier>({
  code: {
    type: String,
    required: [true, 'Supplier code is required'],
    unique: true,
    trim: true
  },
  name: {
    type: localizedStringSchema,
    required: [true, 'Supplier name is required']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  taxId: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required']
  },
  updatedBy: {
    type: String,
    required: [true, 'Updated by is required']
  }
}, {
  timestamps: true
});

// Pre-save hook to generate supplier code if not provided
supplierSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }

  if (!this.code) {
    try {
      this.code = await generateSupplierCode();
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

// Indexes for better query performance
supplierSchema.index({ 'name.en': 'text', 'name.fr': 'text', 'name.ar': 'text', code: 'text', contactPerson: 'text' });
supplierSchema.index({ isActive: 1 });
supplierSchema.index({ createdAt: -1 });

// Use mongoose.models to check if the model already exists
export const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', supplierSchema);
