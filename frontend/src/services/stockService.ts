import apiService from "./api.service";
import { eventService, EventType } from '../modules/shared/services/EventService';
import { assetTrackingService } from '../modules/shared/services/AssetTrackingService';
import { expenseTrackingService } from '../modules/shared/services/ExpenseTrackingService';
import { statusManagementService, StockItemStatus } from '../modules/shared/services/StatusManagementService';
import { stockAccessTokenService } from './stockAccessTokenService';

// Types
export interface StockCategory {
  _id: string;
  name: string;
  description?: string;
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
}

export interface StockMovement {
  id: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  inventoryItem: string;
  reference?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  user: string;
  timestamp: string;
}

export interface PurchaseOrder {
  id: string;
  reference: string;
  supplier: string;
  items: Array<{
    inventoryItem: string;
    quantity: number;
    unitPrice: number;
  }>;
  status: 'pending' | 'received' | 'cancelled';
  expectedDeliveryDate: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  minStockLevel: number;
  category: string;
  supplier?: string;
  status: 'available' | 'low_stock' | 'out_of_stock';
}

// Add new interface for access token
export interface StockAccessToken {
  token: string;
  expiresAt: string;
  operation: 'sale' | 'transfer' | 'adjustment';
  quantity: number;
}

// Add interface for purchase order access token
export interface PurchaseOrderAccessToken {
  token: string;
  expiresAt: string;
  operation: 'receive' | 'cancel' | 'approve';
  items: {
    product: string;
    quantity: number;
  }[];
}

export class StockService {
  private static instance: StockService;
  private activeTokens: Map<string, StockAccessToken> = new Map();
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

  private handleError(error: any): never {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    }
    throw error;
  }

  // Categories
  async getAllCategories(): Promise<StockCategory[]> {
    try {
      const response = await apiService.get('/stock/categories');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createCategory(data: { name: string; description?: string }): Promise<StockCategory> {
    try {
      const response = await apiService.post('/stock/categories', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCategory(id: string, data: { name: string; description?: string }): Promise<StockCategory> {
    try {
      const response = await apiService.patch(`/stock/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await apiService.delete(`/stock/categories/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiService.get('/stock/suppliers');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createSupplier(data: {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    taxId?: string;
  }): Promise<Supplier> {
    try {
      const response = await apiService.post('/stock/suppliers', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    try {
      const response = await apiService.patch(`/stock/suppliers/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async toggleSupplierStatus(id: string): Promise<Supplier> {
    try {
      const response = await apiService.patch(`/stock/suppliers/${id}/toggle-status`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Stock Movements
  async getAllMovements(): Promise<StockMovement[]> {
    try {
      const response = await apiService.get('/stock/movements');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMovement(id: string): Promise<StockMovement> {
    try {
      const response = await apiService.get(`/stock/movements/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to request access token
  async requestAccessToken(
    inventoryItemId: string,
    operation: 'sale' | 'transfer' | 'adjustment',
    quantity: number
  ): Promise<StockAccessToken> {
    try {
      const response = await apiService.post('/stock/access-token', {
        inventoryItem: inventoryItemId,
        operation,
        quantity
      });
      
      const token = response.data.data;
      this.activeTokens.set(inventoryItemId, token);
      
      // Set up auto-expiration
      const expiresIn = new Date(token.expiresAt).getTime() - Date.now();
      setTimeout(() => {
        this.releaseAccessToken(inventoryItemId);
      }, expiresIn);
      
      return token;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to release access token
  async releaseAccessToken(inventoryItemId: string): Promise<void> {
    const token = this.activeTokens.get(inventoryItemId);
    if (token) {
      try {
        await apiService.post(`/stock/access-token/${token.token}/release`);
        this.activeTokens.delete(inventoryItemId);
      } catch (error) {
        console.error('Failed to release access token:', error);
      }
    }
  }

  // Update createMovement to use access token
  async createMovement(data: Omit<StockMovement, 'id' | 'status' | 'user' | 'timestamp'>) {
    try {
      if (data.type === 'out') {
        // Create an expense for outgoing stock
        await this.createExpense({
          amount: data.quantity * data.unitPrice,
          category: 'stock',
          description: `Stock movement: ${data.movementId}`,
        });
      }

      const response = await apiService.post('/stock/movements', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateMovement(id: string, data: Partial<StockMovement>): Promise<StockMovement> {
    try {
      const response = await apiService.patch(`/stock/movements/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteMovement(id: string, reason: string, userId: string): Promise<void> {
    try {
      await apiService.delete(`/stock/movements/${id}`, {
        data: { reason, userId }
      });
    } catch (error) {
      this.handleError(error);
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
    }
  }

  // Purchase Orders
  async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const response = await apiService.get('/stock/purchase-orders');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    try {
      const response = await apiService.get(`/stock/purchase-orders/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
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
      return response.data.data;
    } catch (error) {
      this.handleError(error);
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
    }
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    try {
      await apiService.delete(`/stock/purchase-orders/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Inventory Items
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    try {
      const response = await apiService.get('/stock/inventory');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getInventoryItemById(id: string): Promise<InventoryItem> {
    try {
      const response = await apiService.get(`/stock/inventory/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createInventoryItem(data: {
    name: string;
    sku: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    category: string;
    supplier: string;
    minStockLevel: number;
    valuationMethod?: 'FIFO' | 'LIFO' | 'AVERAGE';
    location?: string;
  }): Promise<InventoryItem> {
    try {
      const response = await apiService.post('/stock/inventory', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateInventoryItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    try {
      const response = await apiService.patch(`/stock/inventory/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteInventoryItem(id: string): Promise<void> {
    try {
      await apiService.delete(`/stock/inventory/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateStockItemStatus(
    id: string, 
    newStatus: StockItemStatus, 
    reason: string, 
    userId: string
  ): Promise<InventoryItem> {
    try {
      const response = await apiService.patch(`/stock/inventory/${id}/status`, {
        status: newStatus,
        reason,
        userId
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
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