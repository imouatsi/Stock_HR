import { Document } from 'mongoose';
import { ILocalizedString } from './product.interface';

export interface IWarehouse extends Document {
  code: string;
  name: ILocalizedString;
  address: string;
  manager: string; // Reference to user ID
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWarehouseInput {
  code: string;
  name: ILocalizedString;
  address: string;
  manager: string;
  isActive?: boolean;
}

export interface IWarehouseUpdate extends Partial<IWarehouseInput> {
  updatedBy: string;
}

export interface IWarehouseFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
