import mongoose, { Schema, Document } from 'mongoose';
import { IStockItem } from '../interfaces/stock.interface';

const stockItemSchema = new Schema<IStockItem>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    integer: true
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true
  },
  reorderPoint: {
    type: Number,
    required: [true, 'Reorder point is required'],
    min: [0, 'Reorder point cannot be negative'],
    integer: true
  },
  location: {
    type: String,
    trim: true
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
stockItemSchema.index({ name: 1 });
stockItemSchema.index({ category: 1 });
stockItemSchema.index({ supplier: 1 });
stockItemSchema.index({ quantity: 1 });
stockItemSchema.index({ createdAt: -1 });

// Add a compound index for text search
stockItemSchema.index(
  { name: 'text', description: 'text', category: 'text', supplier: 'text' },
  { weights: { name: 10, description: 5, category: 3, supplier: 3 } }
);

export const StockItem = mongoose.model<IStockItem>('StockItem', stockItemSchema); 