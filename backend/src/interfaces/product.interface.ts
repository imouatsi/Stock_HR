import { Document } from 'mongoose';

export interface ILocalizedString {
  en: string;
  fr: string;
  ar: string;
}

export interface IProduct extends Document {
  code: string;
  name: ILocalizedString;
  description?: ILocalizedString;
  category: string;
  supplier: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  tvaRate: number;
  barcode?: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductInput {
  code?: string; // Optional as it can be auto-generated
  name: ILocalizedString;
  description?: ILocalizedString;
  category: string;
  supplier: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  tvaRate: number;
  barcode?: string;
  isActive?: boolean;
}

export interface IProductUpdate extends Partial<IProductInput> {
  updatedBy: string;
}

export interface IProductFilters {
  search?: string;
  category?: string;
  supplier?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
