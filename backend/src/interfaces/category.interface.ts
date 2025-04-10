import { Document } from 'mongoose';
import { ILocalizedString } from './product.interface';

export interface ICategory extends Document {
  code: string;
  name: ILocalizedString;
  description?: ILocalizedString;
  parent?: string; // Reference to parent category ID
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryInput {
  code: string;
  name: ILocalizedString;
  description?: ILocalizedString;
  parent?: string;
  isActive?: boolean;
}

export interface ICategoryUpdate extends Partial<ICategoryInput> {
  updatedBy: string;
}

export interface ICategoryFilters {
  search?: string;
  parent?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
