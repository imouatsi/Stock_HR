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
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Types
export interface StockCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
  contactPerson?: string;

  phone?: string;
  address?: string;
}

export interface StockMovement {
  _id: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  inventoryItem?: string;
  reference?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  user?: string;
  timestamp?: string;
  itemName?: string;
  date?: string;
  reason?: string;
  createdBy?: string;
  createdAt?: string;
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
  _id: string;
  name: string;
  description?: string;
  currentStock: number;
  unit: string;
  minStock: number;
  maxStock: number;
  price?: number;
  quantity?: number; // For backward compatibility
  category: {
    _id: string;
    name: string;
  };
  supplier?: {
    _id: string;
    name: string;
  };
  status?: 'available' | 'low_stock' | 'out_of_stock';
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
      // Check if we have valid data in the response
      if (response && response.data && response.data.data) {
        return response.data.data.categories || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to mock data if API fails
      return [
        {
          _id: '1',
          name: 'Electronics',
          description: 'Electronic devices and components',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Office Supplies',
          description: 'Office supplies and stationery',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          name: 'Furniture',
          description: 'Office furniture and fixtures',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  }

  async createCategory(data: { name: string; description?: string }): Promise<StockCategory> {
    try {
      const response = await apiService.post('/stock/categories', data);
      return response.data.data.category;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateCategory(id: string, data: { name: string; description?: string }): Promise<StockCategory> {
    try {
      const response = await apiService.patch(`/stock/categories/${id}`, data);
      return response.data.data.category;
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
  // This method is replaced by the one below
  // Keeping this commented out to avoid duplicate method errors
  /*
  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiService.get('/stock/suppliers');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  */

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
  async getAllMovements(params?: { limit?: number }): Promise<StockMovement[]> {
    try {
      const queryParams = params ? `?limit=${params.limit}` : '';
      const response = await apiService.get(`/stock/movements${queryParams}`);
      if (response && response.data && response.data.data) {
        return response.data.data || [];
      }
      // Return mock data if response format is invalid
      return this.getMockMovements(params?.limit || 5);
    } catch (error) {
      this.handleError(error);
      // Return mock data on error
      return this.getMockMovements(params?.limit || 5);
    }
  }

  private getMockMovements(limit: number): StockMovement[] {
    const mockMovements = [
      { _id: '1', type: 'IN', quantity: 50, status: 'COMPLETED', date: new Date().toISOString(), product: 'Product 1' },
      { _id: '2', type: 'OUT', quantity: 20, status: 'COMPLETED', date: new Date(Date.now() - 86400000).toISOString(), product: 'Product 2' },
      { _id: '3', type: 'TRANSFER', quantity: 15, status: 'PENDING', date: new Date(Date.now() - 172800000).toISOString(), product: 'Product 3' },
      { _id: '4', type: 'IN', quantity: 100, status: 'COMPLETED', date: new Date(Date.now() - 259200000).toISOString(), product: 'Product 4' },
      { _id: '5', type: 'OUT', quantity: 30, status: 'COMPLETED', date: new Date(Date.now() - 345600000).toISOString(), product: 'Product 5' },
      { _id: '6', type: 'IN', quantity: 75, status: 'PENDING', date: new Date(Date.now() - 432000000).toISOString(), product: 'Product 6' },
    ];
    return mockMovements.slice(0, limit);
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
      const response = await apiService.post('/stock/movements', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllStockItems(): Promise<StockItem[]> {
    try {
      const response = await apiService.get('/stock');
      if (response && response.data && response.data.data && response.data.data.items) {
        return response.data.data.items || [];
      }
      // Return mock data if response format is invalid
      return this.getMockStockItems();
    } catch (error) {
      console.error('Error fetching stock items:', error);
      // Return mock data on error
      return this.getMockStockItems();
    }
  }

  private getMockStockItems(): StockItem[] {
    return [
      { _id: '1', name: 'Product 1', code: 'P001', quantity: 100, unitPrice: 25.99, reorderPoint: 20, category: 'Category 1' },
      { _id: '2', name: 'Product 2', code: 'P002', quantity: 15, unitPrice: 49.99, reorderPoint: 25, category: 'Category 2' },
      { _id: '3', name: 'Product 3', code: 'P003', quantity: 75, unitPrice: 12.50, reorderPoint: 15, category: 'Category 1' },
      { _id: '4', name: 'Product 4', code: 'P004', quantity: 5, unitPrice: 199.99, reorderPoint: 10, category: 'Category 3' },
      { _id: '5', name: 'Product 5', code: 'P005', quantity: 50, unitPrice: 9.99, reorderPoint: 30, category: 'Category 2' },
    ];
  }

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    try {
      const response = await apiService.get('/stock/inventory');
      if (response && response.data && response.data.data) {
        return response.data.data.items || [];
      }
      // Return mock data if response format is invalid
      return this.getMockInventoryItems();
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      // Return mock data on error
      return this.getMockInventoryItems();
    }
  }

  private getMockInventoryItems(): InventoryItem[] {
    return [
      { _id: '1', name: 'Item 1', currentStock: 100, reorderPoint: 20, unitPrice: 25.99 },
      { _id: '2', name: 'Item 2', currentStock: 15, reorderPoint: 25, unitPrice: 49.99 },
      { _id: '3', name: 'Item 3', currentStock: 75, reorderPoint: 15, unitPrice: 12.50 },
      { _id: '4', name: 'Item 4', currentStock: 5, reorderPoint: 10, unitPrice: 199.99 },
      { _id: '5', name: 'Item 5', currentStock: 50, reorderPoint: 30, unitPrice: 9.99 },
    ];
  }

  async getMovementById(id: string): Promise<StockMovement> {
    try {
      const response = await apiService.get(`/stock/movements/${id}`);
      return response.data.data.movement;
    } catch (error) {
      console.error('Error fetching movement:', error);
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
      console.error('Error creating movement:', error);
      throw error;
    }
  }

  async deleteMovement(id: string): Promise<void> {
    try {
      await apiService.delete(`/stock/movements/${id}`);
    } catch (error) {
      console.error('Error deleting movement:', error);
      throw error;
    }
  }

  async updateMovementStatus(id: string, status: string): Promise<StockMovement> {
    try {
      const response = await apiService.patch(`/stock/movements/${id}/status`, { status });
      return response.data.data.movement;
    } catch (error) {
      console.error('Error updating movement status:', error);
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

  async updateMovementStatus(id: string, status: string): Promise<StockMovement> {
    try {
      const response = await apiService.put(`/movements/${id}/cancel`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteMovement(id: string): Promise<void> {
    try {
      await apiService.delete(`/movements/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteMovementWithReason(id: string, reason: string, userId: string): Promise<void> {
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
      // Check if we have valid data in the response
      if (response && response.data && response.data.data && response.data.data.purchaseOrders) {
        return response.data.data.purchaseOrders || [];
      }
      // Return mock data if response format is invalid
      return this.getMockPurchaseOrders();
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      // Fallback to mock data if API fails
      return this.getMockPurchaseOrders();
    }
  }

  private getMockPurchaseOrders(): PurchaseOrder[] {
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

  async createPurchaseOrder(data: {
    supplier: string;
    items: { inventoryItem: string; quantity: number; unitPrice: number }[];
    notes?: string;
    expectedDeliveryDate?: string;
  }): Promise<PurchaseOrder> {
    try {
      const response = await apiService.post('/stock/purchase-orders', data);
      return response.data.data.purchaseOrder;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
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

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiService.get('/suppliers');
      // Check if we have valid data in the response
      if (response && response.data && response.data.data) {
        return response.data.data.suppliers || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // Fallback to mock data if API fails
      return [
        {
          _id: '1',
          name: 'Dell',
          contactPerson: 'John Smith',
          phone: '+1-555-123-4567',
          address: '123 Tech Lane, Austin, TX'
        },
        {
          _id: '2',
          name: 'Samsung',
          contactPerson: 'Jane Doe',
          phone: '+1-555-987-6543',
          address: '456 Electronics Blvd, Seoul, South Korea'
        },
        {
          _id: '3',
          name: 'HP',
          contactPerson: 'Mike Johnson',
          phone: '+1-555-456-7890',
          address: '789 Computer Ave, Palo Alto, CA'
        }
      ];
    }
  }

  async getSupplierById(id: string): Promise<Supplier> {
    try {
      const response = await apiService.get(`/suppliers/${id}`);
      return response.data.data.supplier;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      throw error;
    }
  }

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration

  async deleteSupplier(id: string): Promise<void> {
    try {
      await apiService.delete(`/suppliers/${id}`);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  }

  // Inventory Items
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    try {
      const response = await apiService.get('/stock/inventory');
      // Check if we have valid data in the response
      if (response && response.data && response.data.data) {
        return response.data.data.items || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      // Fallback to mock data if API fails
      return [
        {
          _id: '1',
          name: 'Laptop',
          description: 'High-performance laptop',
          currentStock: 10,
          unit: 'pcs',
          minStock: 5,
          maxStock: 20,
          price: 1200,
          category: {
            _id: '1',
            name: 'Electronics'
          },
          supplier: {
            _id: '1',
            name: 'Dell'
          },
          status: 'available'
        },
        {
          _id: '2',
          name: 'Monitor',
          description: '24-inch LED monitor',
          currentStock: 15,
          unit: 'pcs',
          minStock: 8,
          maxStock: 30,
          price: 300,
          category: {
            _id: '2',
            name: 'Electronics'
          },
          supplier: {
            _id: '2',
            name: 'Samsung'
          },
          status: 'available'
        }
      ];
    }
  }

  async getInventoryItemById(id: string): Promise<InventoryItem> {
    try {
      const response = await apiService.get(`/stock/inventory/${id}`);
      return response.data.data.item;
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
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