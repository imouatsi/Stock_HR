import mongoose from 'mongoose';
import { IInventory } from '../interfaces/inventory.interface';

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Item description is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Item quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Item unit is required']
  },
  price: {
    type: Number,
    required: [true, 'Item price is required'],
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema); 