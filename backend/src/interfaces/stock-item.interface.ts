import { Document } from 'mongoose';

export interface IStockItem extends Document {
  product: string; // Reference to product ID
  warehouse: string; // Reference to warehouse ID
  quantity: number;
  minQuantity: number;
  expiryDate?: Date;
  batchNumber?: string;
  unitConversion?: {
    from: string;
    to: string;
    factor: number;
  };
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStockItemInput {
  product: string;
  warehouse: string;
  quantity: number;
  minQuantity: number;
  expiryDate?: Date;
  batchNumber?: string;
  unitConversion?: {
    from: string;
    to: string;
    factor: number;
  };
  isActive?: boolean;
}

export interface IStockItemUpdate extends Partial<IStockItemInput> {
  updatedBy: string;
}

export interface IStockItemFilters {
  product?: string;
  warehouse?: string;
  lowStock?: boolean;
  expired?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
