import { Document } from 'mongoose';
import { ILocalizedString } from './product.interface';

export interface ISupplier extends Document {
  code: string;
  name: ILocalizedString;
  contactPerson: string;
  phone: string;
  address: string;
  email?: string;
  taxId?: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISupplierInput {
  code: string;
  name: ILocalizedString;
  contactPerson: string;
  phone: string;
  address: string;
  email?: string;
  taxId?: string;
  isActive?: boolean;
}

export interface ISupplierUpdate extends Partial<ISupplierInput> {
  updatedBy: string;
}

export interface ISupplierFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
