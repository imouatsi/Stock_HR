import mongoose, { Schema } from 'mongoose';
import { IStockItem } from '../interfaces/stock-item.interface';

const unitConversionSchema = new Schema({
  from: {
    type: String,
    required: [true, 'From unit is required'],
    trim: true
  },
  to: {
    type: String,
    required: [true, 'To unit is required'],
    trim: true
  },
  factor: {
    type: Number,
    required: [true, 'Conversion factor is required'],
    min: [0.000001, 'Conversion factor must be positive']
  }
}, { _id: false });

const stockItemSchema = new Schema<IStockItem>({
  product: {
    type: String,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  warehouse: {
    type: String,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  minQuantity: {
    type: Number,
    required: [true, 'Minimum quantity is required'],
    min: [0, 'Minimum quantity cannot be negative']
  },
  expiryDate: {
    type: Date
  },
  batchNumber: {
    type: String,
    trim: true
  },
  unitConversion: {
    type: unitConversionSchema
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

// Compound index to ensure uniqueness of product-warehouse combination
stockItemSchema.index({ product: 1, warehouse: 1, batchNumber: 1 }, { unique: true });

// Indexes for better query performance
stockItemSchema.index({ product: 1 });
stockItemSchema.index({ warehouse: 1 });
stockItemSchema.index({ quantity: 1 });
stockItemSchema.index({ expiryDate: 1 });
stockItemSchema.index({ isActive: 1 });
stockItemSchema.index({ createdAt: -1 });

// Virtual for low stock status
stockItemSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.minQuantity;
});

// Virtual for expired status
stockItemSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Use mongoose.models to check if the model already exists
export const StockItem = mongoose.models.StockItem || mongoose.model<IStockItem>('StockItem', stockItemSchema);
