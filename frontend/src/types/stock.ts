export type StockItemStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface StockCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockItem {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  sku: string;
  barcode?: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  costPrice: number;
  sellingPrice: number;
  status: StockItemStatus;
  location?: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type StockCategoryFormData = Omit<StockCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type StockItemFormData = Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>;
export type StockMovementFormData = Omit<StockMovement, 'id' | 'createdAt' | 'updatedAt'>;
export type PurchaseOrderFormData = Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>;
export type SupplierFormData = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>; 