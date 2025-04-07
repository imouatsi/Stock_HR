import { Document } from 'mongoose';

export interface IStockItem extends Document {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
  reorderPoint: number;
  location?: string;
  lastRestocked: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStockItemInput {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
  reorderPoint: number;
  location?: string;
}

export interface IStockItemUpdate extends Partial<IStockItemInput> {
  lastRestocked?: Date;
}

export interface IStockFilters {
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 