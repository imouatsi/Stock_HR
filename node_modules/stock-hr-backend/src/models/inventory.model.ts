import mongoose, { Schema, Document } from 'mongoose';
import { IStockCategory } from '../modules/stock/models/stockCategory.model';
import { ISupplier } from '../modules/stock/models/supplier.model';

export interface IInventoryItem extends Document {
  name: string;
  description?: string;
  sku: string;
  category: IStockCategory['_id'];
  supplier: ISupplier['_id'];
  quantity: number;
  unitPrice: number;
  minStockLevel: number;
  valuationMethod: 'FIFO' | 'LIFO' | 'Average';
  location?: string;
  status: 'active' | 'discontinued';
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventoryItem>(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'StockCategory',
      required: [true, 'Category is required'],
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    minStockLevel: {
      type: Number,
      required: [true, 'Minimum stock level is required'],
      min: [0, 'Minimum stock level cannot be negative'],
      default: 0,
    },
    valuationMethod: {
      type: String,
      enum: ['FIFO', 'LIFO', 'Average'],
      default: 'FIFO',
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'discontinued'],
      default: 'active',
    },
    lastRestocked: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
inventorySchema.index({ sku: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ supplier: 1 });
inventorySchema.index({ status: 1 });

// Virtual for stock value
inventorySchema.virtual('stockValue').get(function() {
  return this.quantity * this.unitPrice;
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.quantity <= 0) return 'out_of_stock';
  if (this.quantity <= this.minStockLevel) return 'low_stock';
  return 'in_stock';
});

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', inventorySchema); 