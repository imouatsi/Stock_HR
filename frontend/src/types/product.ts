export interface LocalizedString {
  en: string;
  fr: string;
  ar: string;
}

export interface Product {
  _id: string;
  code: string;
  name: LocalizedString;
  description?: LocalizedString;
  category: string | {
    _id: string;
    name: LocalizedString;
    code: string;
  };
  supplier: string | {
    _id: string;
    name: LocalizedString;
    code: string;
  };
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  tvaRate: number;
  barcode?: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  code?: string;
  name: LocalizedString;
  description?: LocalizedString;
  category: string;
  supplier: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  tvaRate: number;
  barcode?: string;
  isActive?: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  supplier?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductPagination {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
