import { Document } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
} 