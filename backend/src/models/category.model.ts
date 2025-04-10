import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../interfaces/category.interface';
import { generateCategoryCode } from '../utils/codeGenerator';

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

const categorySchema = new Schema<ICategory>({
  code: {
    type: String,
    required: [true, 'Category code is required'],
    unique: true,
    trim: true
  },
  name: {
    type: localizedStringSchema,
    required: [true, 'Category name is required']
  },
  description: {
    type: localizedStringSchema
  },
  parent: {
    type: String,
    ref: 'Category'
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

// Pre-save hook to generate category code if not provided
categorySchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }

  if (!this.code) {
    try {
      this.code = await generateCategoryCode();
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

// Indexes for better query performance
categorySchema.index({ 'name.en': 'text', 'name.fr': 'text', 'name.ar': 'text', code: 'text' });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ createdAt: -1 });

// Use mongoose.models to check if the model already exists
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
