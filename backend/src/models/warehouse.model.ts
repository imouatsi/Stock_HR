import mongoose, { Schema } from 'mongoose';
import { IWarehouse } from '../interfaces/warehouse.interface';
import { generateWarehouseCode } from '../utils/codeGenerator';

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

const warehouseSchema = new Schema<IWarehouse>({
  code: {
    type: String,
    required: [true, 'Warehouse code is required'],
    unique: true,
    trim: true
  },
  name: {
    type: localizedStringSchema,
    required: [true, 'Warehouse name is required']
  },
  address: {
    type: String,
    required: [true, 'Warehouse address is required'],
    trim: true
  },
  manager: {
    type: String,
    ref: 'User',
    required: [true, 'Warehouse manager is required']
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

// Pre-save hook to generate warehouse code if not provided
warehouseSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }

  if (!this.code) {
    try {
      this.code = await generateWarehouseCode();
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

// Indexes for better query performance
warehouseSchema.index({ 'name.en': 'text', 'name.fr': 'text', 'name.ar': 'text', code: 'text' });
warehouseSchema.index({ manager: 1 });
warehouseSchema.index({ isActive: 1 });
warehouseSchema.index({ createdAt: -1 });

// Use mongoose.models to check if the model already exists
export const Warehouse = mongoose.models.Warehouse || mongoose.model<IWarehouse>('Warehouse', warehouseSchema);
