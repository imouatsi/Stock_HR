import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventoryItem>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
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
    }
  },
  {
    timestamps: true
  }
);

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', inventorySchema); 