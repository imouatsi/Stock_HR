import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../interfaces/product.interface';
import { generateProductCode } from '../utils/codeGenerator';

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

const productSchema = new Schema<IProduct>({
  code: {
    type: String,
    required: [true, 'Product code is required'],
    unique: true,
    trim: true
  },
  name: {
    type: localizedStringSchema,
    required: [true, 'Product name is required']
  },
  description: {
    type: localizedStringSchema
  },
  category: {
    type: String,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  supplier: {
    type: String,
    ref: 'Supplier',
    required: [true, 'Supplier is required']
  },
  unit: {
    type: String,
    required: [true, 'Unit of measurement is required'],
    trim: true
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price cannot be negative']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative']
  },
  tvaRate: {
    type: Number,
    required: [true, 'TVA rate is required'],
    enum: [0, 9, 19],
    default: 19
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
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

// Pre-save hook to generate product code if not provided
productSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }

  if (!this.code) {
    try {
      this.code = await generateProductCode();
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

// Indexes for better query performance
productSchema.index({ 'name.en': 'text', 'name.fr': 'text', 'name.ar': 'text', code: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

// Use mongoose.models to check if the model already exists
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
