import { LocalizedString } from './product';

export interface Warehouse {
  _id: string;
  code: string;
  name: LocalizedString;
  address: string;
  manager: string | {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseInput {
  code?: string;
  name: LocalizedString;
  address: string;
  manager: string;
  isActive?: boolean;
}

export interface WarehouseFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface WarehousePagination {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
