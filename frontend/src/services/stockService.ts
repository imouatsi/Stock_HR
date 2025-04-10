import apiService from "./api.service";
import { eventService, EventType } from '../modules/shared/services/EventService';
import { assetTrackingService } from '../modules/shared/services/AssetTrackingService';
import { expenseTrackingService } from '../modules/shared/services/ExpenseTrackingService';
import { statusManagementService, StockItemStatus } from '../modules/shared/services/StatusManagementService';
import { stockAccessTokenService } from './stockAccessTokenService';

// Real data interface for StockItem from backend
export interface StockItem {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
  reorderPoint: number;
  location?: string;
  lastRestocked: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  code?: string;
}

// Stock Category interface
export interface StockCategory {
  _id: string;
  name: string;
  description?: string;
  parent?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Supplier interface
export interface Supplier {
  _id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  nif?: string; // Algerian tax ID
  rc?: string; // Commercial registry number
  ai?: string; // Article of imposition
  status?: 'active' | 'inactive';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Stock Movement interface
export interface StockMovement {
  _id: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  inventoryItem: string;
  source?: string;
  destination?: string;
  reference?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  date?: string;
  product?: string;
  reason?: string;
  itemName?: string;
}

// Purchase Order interface
export interface PurchaseOrder {
  _id?: string;
  id?: string;
  reference: string;
  supplier: string;
  items: {
    inventoryItem: string;
    quantity: number;
    unitPrice: number;
  }[];
  status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  expectedDeliveryDate: string;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Inventory Item interface
export interface InventoryItem {
  _id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  minStock: number;
  maxStock: number;
  currentStock: number;
  reorderPoint?: number;
  unitPrice?: number;
  location?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Purchase Order Access Token interface
export interface PurchaseOrderAccessToken {
  token: string;
  purchaseOrder: string;
  operation: 'receive' | 'cancel' | 'approve';
  expiresAt: string;
  createdAt: string;
}

// Warehouse interface
export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Singleton service for stock management
class StockService {
  private static instance: StockService;
  private activePurchaseOrderTokens: Map<string, PurchaseOrderAccessToken> = new Map();

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.EXPENSE_APPROVED, this.handleExpenseApproved);
  }

  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  private handleError(error: any): void {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }

  // Categories
  async getAllCategories(): Promise<StockCategory[]> {
    try {
      const response = await apiService.get('/stock/categories');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getCategory(id: string): Promise<StockCategory> {
    try {
      const response = await apiService.get(`/stock/categories/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createCategory(data: {
    name: string;
    description?: string;
    parent?: string;
  }): Promise<StockCategory> {
    try {
      const response = await apiService.post('/stock/categories', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateCategory(id: string, data: Partial<StockCategory>): Promise<StockCategory> {
    try {
      const response = await apiService.patch(`/stock/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await apiService.delete(`/stock/categories/${id}`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiService.get('/stock/suppliers');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getSupplier(id: string): Promise<Supplier> {
    try {
      const response = await apiService.get(`/stock/suppliers/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createSupplier(data: {
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    nif?: string;
    rc?: string;
    ai?: string;
  }): Promise<Supplier> {
    try {
      const response = await apiService.post('/stock/suppliers', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    try {
      const response = await apiService.patch(`/stock/suppliers/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async toggleSupplierStatus(id: string): Promise<Supplier> {
    try {
      const response = await apiService.patch(`/stock/suppliers/${id}/toggle-status`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Stock Movements
  async getAllMovements(params?: { limit?: number }): Promise<StockMovement[]> {
    try {
      const queryParams = params ? `?limit=${params.limit}` : '';
      const response = await apiService.get(`/stock/movements${queryParams}`);
      if (response && response.data && response.data.data) {
        return response.data.data || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      throw error;
    }
  }

  private getMockMovements(limit: number): StockMovement[] {
    throw new Error('Mock data is not allowed');
    // @ts-ignore
    const mockMovements = [
      { _id: '1', type: 'in', quantity: 50, status: 'completed', date: new Date().toISOString(), product: 'Product 1' },
      { _id: '2', type: 'out', quantity: 20, status: 'completed', date: new Date(Date.now() - 86400000).toISOString(), product: 'Product 2' },
      { _id: '3', type: 'transfer', quantity: 15, status: 'pending', date: new Date(Date.now() - 172800000).toISOString(), product: 'Product 3' },
      { _id: '4', type: 'in', quantity: 100, status: 'completed', date: new Date(Date.now() - 259200000).toISOString(), product: 'Product 4' },
      { _id: '5', type: 'out', quantity: 30, status: 'completed', date: new Date(Date.now() - 345600000).toISOString(), product: 'Product 5' },
      { _id: '6', type: 'in', quantity: 75, status: 'pending', date: new Date(Date.now() - 432000000).toISOString(), product: 'Product 6' },
    ];
    return mockMovements.slice(0, limit);
  }

  async getMovement(id: string): Promise<StockMovement> {
    try {
      const response = await apiService.get(`/stock/movements/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getMovementById(id: string): Promise<StockMovement> {
    try {
      const response = await apiService.get(`/stock/movements/${id}`);
      return response.data.data.movement;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createMovement(data: {
    inventoryItem: string;
    quantity: number;
    type: 'in' | 'out' | 'transfer';
    reference?: string;
    notes?: string;
  }): Promise<StockMovement> {
    try {
      const response = await apiService.post('/stock/movements', data);
      return response.data.data.movement;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteMovement(id: string): Promise<void> {
    try {
      await apiService.delete(`/stock/movements/${id}`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateMovement(id: string, data: Partial<StockMovement>): Promise<StockMovement> {
    try {
      const response = await apiService.patch(`/stock/movements/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateMovementStatus(id: string, status: string): Promise<StockMovement> {
    try {
      const response = await apiService.put(`/movements/${id}/cancel`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteMovementWithReason(id: string, reason: string, userId: string): Promise<void> {
    try {
      await apiService.delete(`/stock/movements/${id}`, {
        data: { reason, userId }
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async cancelMovement(id: string, reason: string, userId: string): Promise<StockMovement> {
    try {
      const response = await apiService.patch(`/stock/movements/${id}/cancel`, {
        reason,
        userId
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Purchase Orders
  async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const response = await apiService.get('/stock/purchase-orders');
      // Check if we have valid data in the response
      if (response && response.data && response.data.data && response.data.data.purchaseOrders) {
        return response.data.data.purchaseOrders || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  }

  private getMockPurchaseOrders(): PurchaseOrder[] {
    throw new Error('Mock data is not allowed');
    // @ts-ignore
    return [
      {
        id: '1',
        reference: 'PO-2023-001',
        supplier: '1',
        items: [
          { inventoryItem: '1', quantity: 5, unitPrice: 1200 },
          { inventoryItem: '2', quantity: 3, unitPrice: 300 }
        ],
        status: 'pending',
        expectedDeliveryDate: new Date().toISOString(),
        notes: 'Urgent delivery needed'
      },
      {
        id: '2',
        reference: 'PO-2023-002',
        supplier: '2',
        items: [
          { inventoryItem: '2', quantity: 10, unitPrice: 300 }
        ],
        status: 'received',
        expectedDeliveryDate: new Date().toISOString(),
        notes: 'Regular order'
      }
    ];
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    try {
      const response = await apiService.get(`/stock/purchase-orders/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createPurchaseOrder(data: {
    supplier: string;
    items: { inventoryItem: string; quantity: number; unitPrice: number }[];
    notes?: string;
    expectedDeliveryDate: string;
  }): Promise<PurchaseOrder> {
    try {
      const response = await apiService.post('/stock/purchase-orders', data);
      return response.data.data.purchaseOrder;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async requestPurchaseOrderAccessToken(
    purchaseOrderId: string,
    operation: 'receive' | 'cancel' | 'approve',
    items?: { product: string; quantity: number }[]
  ): Promise<PurchaseOrderAccessToken> {
    try {
      const response = await apiService.post('/stock/purchase-orders/access-token', {
        purchaseOrder: purchaseOrderId,
        operation,
        items
      });

      const token = response.data.data;
      this.activePurchaseOrderTokens.set(purchaseOrderId, token);

      // Set up auto-expiration
      const expiresIn = new Date(token.expiresAt).getTime() - Date.now();
      setTimeout(() => {
        this.releasePurchaseOrderAccessToken(purchaseOrderId);
      }, expiresIn);

      return token;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async releasePurchaseOrderAccessToken(purchaseOrderId: string): Promise<void> {
    const token = this.activePurchaseOrderTokens.get(purchaseOrderId);
    if (token) {
      try {
        await apiService.post(`/stock/purchase-orders/access-token/${token.token}/release`);
        this.activePurchaseOrderTokens.delete(purchaseOrderId);
      } catch (error) {
        console.error('Failed to release purchase order access token:', error);
      }
    }
  }

  async updatePurchaseOrderStatus(
    id: string,
    status: string,
    receivedItems?: { product: string; quantity: number }[]
  ): Promise<PurchaseOrder> {
    try {
      const response = await apiService.patch(`/stock/purchase-orders/${id}/status`, {
        status,
        receivedItems
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    try {
      await apiService.delete(`/stock/purchase-orders/${id}`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Suppliers
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    try {
      const response = await apiService.get('/stock/inventory');
      if (response && response.data && response.data.data) {
        return response.data.data.items || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  }

  private getMockInventoryItems(): InventoryItem[] {
    throw new Error('Mock data is not allowed');
    // @ts-ignore
    return [
      { _id: '1', name: 'Item 1', currentStock: 100, reorderPoint: 20, unitPrice: 25.99, category: 'Category 1', unit: 'pcs', minStock: 10, maxStock: 200 },
      { _id: '2', name: 'Item 2', currentStock: 15, reorderPoint: 25, unitPrice: 49.99, category: 'Category 2', unit: 'pcs', minStock: 20, maxStock: 100 },
      { _id: '3', name: 'Item 3', currentStock: 75, reorderPoint: 15, unitPrice: 12.50, category: 'Category 1', unit: 'kg', minStock: 5, maxStock: 150 },
      { _id: '4', name: 'Item 4', currentStock: 5, reorderPoint: 10, unitPrice: 199.99, category: 'Category 3', unit: 'pcs', minStock: 2, maxStock: 50 },
      { _id: '5', name: 'Item 5', currentStock: 50, reorderPoint: 30, unitPrice: 9.99, category: 'Category 2', unit: 'l', minStock: 20, maxStock: 100 },
    ];
  }

  async getAllStockItems(): Promise<StockItem[]> {
    try {
      const response = await apiService.get('/stock');
      if (response && response.data && response.data.data && response.data.data.items) {
        return response.data.data.items || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching stock items:', error);
      throw error;
    }
  }

  private getMockStockItems(): StockItem[] {
    throw new Error('Mock data is not allowed');
    // @ts-ignore
    return [
      { _id: '1', name: 'Product 1', code: 'P001', quantity: 100, unitPrice: 25.99, reorderPoint: 20, category: 'Category 1', supplier: 'Supplier 1', lastRestocked: new Date().toISOString(), createdBy: 'admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: '2', name: 'Product 2', code: 'P002', quantity: 15, unitPrice: 49.99, reorderPoint: 25, category: 'Category 2', supplier: 'Supplier 2', lastRestocked: new Date().toISOString(), createdBy: 'admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: '3', name: 'Product 3', code: 'P003', quantity: 75, unitPrice: 12.50, reorderPoint: 15, category: 'Category 1', supplier: 'Supplier 1', lastRestocked: new Date().toISOString(), createdBy: 'admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: '4', name: 'Product 4', code: 'P004', quantity: 5, unitPrice: 199.99, reorderPoint: 10, category: 'Category 3', supplier: 'Supplier 3', lastRestocked: new Date().toISOString(), createdBy: 'admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: '5', name: 'Product 5', code: 'P005', quantity: 50, unitPrice: 9.99, reorderPoint: 30, category: 'Category 2', supplier: 'Supplier 2', lastRestocked: new Date().toISOString(), createdBy: 'admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
  }

  async createInventoryItem(data: {
    name: string;
    description?: string;
    category: string;
    unit: string;
    minStock: number;
    maxStock: number;
    currentStock: number;
  }): Promise<InventoryItem> {
    try {
      const response = await apiService.post('/stock/inventory', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateInventoryItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    try {
      const response = await apiService.patch(`/stock/inventory/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteInventoryItem(id: string): Promise<void> {
    try {
      await apiService.delete(`/stock/inventory/${id}`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateStockItemStatus(
    id: string,
    newStatus: StockItemStatus,
    reason: string,
    userId: string
  ): Promise<StockItem> {
    try {
      const response = await apiService.patch(`/stock/items/${id}/status`, {
        status: newStatus,
        reason,
        userId
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async reportStockLoss(
    itemIds: string[],
    incidentType: 'flood' | 'fire' | 'theft' | 'damage' | 'other',
    description: string,
    userId: string
  ): Promise<void> {
    try {
      await apiService.post('/stock/inventory/loss', {
        itemIds,
        incidentType,
        description,
        userId
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private async handleExpenseApproved(data: { expenseId: string; amount: number; category: string; createdBy: string; departmentId: string }) {
    // Handle expense approval logic
  }
}

// Create and export a singleton instance
export const stockService = StockService.getInstance();

// Default export
export default stockService;
