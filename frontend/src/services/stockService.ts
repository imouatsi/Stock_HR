import { api } from './api';
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
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  _id: string;
  inventoryItem: string;
  quantity: number;
  type: 'in' | 'out' | 'transfer';
  source?: string;
  destination?: string;
  timestamp: string;
  user: string;
  notes?: string;
  reference: string;
  status: 'pending' | 'completed' | 'cancelled' | 'reversed';
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
  minStockLevel: number;
  valuationMethod: 'FIFO' | 'LIFO' | 'AVERAGE';
  status: StockItemStatus;
  location?: string;
  lastRestocked?: string;
  createdAt: string;
  updatedAt: string;
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

class StockService {
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
      const response = await api.get('/stock/categories');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createCategory(data: { name: string; description?: string }): Promise<StockCategory> {
    try {
      const response = await api.post('/stock/categories', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCategory(id: string, data: { name: string; description?: string }): Promise<StockCategory> {
    try {
      const response = await api.patch(`/stock/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/stock/categories/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const response = await api.get('/stock/suppliers');
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
      const response = await api.post('/stock/suppliers', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    try {
      const response = await api.patch(`/stock/suppliers/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async toggleSupplierStatus(id: string): Promise<Supplier> {
    try {
      const response = await api.patch(`/stock/suppliers/${id}/toggle-status`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Stock Movements
  async getAllMovements(params?: { limit?: number; type?: string; status?: string }): Promise<StockMovement[]> {
    try {
      const response = await api.get('/stock/movements', { params });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMovementById(id: string): Promise<StockMovement> {
    try {
      const response = await api.get(`/stock/movements/${id}`);
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
      const response = await api.post('/stock/access-token', {
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
        await api.post(`/stock/access-token/${token.token}/release`);
        this.activeTokens.delete(inventoryItemId);
      } catch (error) {
        console.error('Failed to release access token:', error);
      }
    }
  }

  // Update createMovement to use access token
  async createMovement(data: {
    inventoryItem: string;
    quantity: number;
    type: 'in' | 'out' | 'transfer';
    source?: string;
    destination?: string;
    notes?: string;
  }): Promise<StockMovement> {
    try {
      // For outgoing movements, request an access token first
      if (data.type === 'out') {
        const token = await stockAccessTokenService.requestAccessToken({
          inventoryItem: data.inventoryItem,
          operation: 'sale',
          quantity: data.quantity
        });
        
        // Add the token to the movement data
        data.accessToken = token.token;
      }

      const response = await api.post('/stock/movements', data);
      const result = response.data.data;

      // Emit event for cross-module communication
      eventService.emit(EventType.STOCK_MOVEMENT_CREATED, {
        movementId: result._id,
        itemId: result.inventoryItem,
        quantity: result.quantity,
        type: result.type,
        userId: result.user
      });

      // Check if item is low in stock
      const item = await this.getInventoryItem(result.inventoryItem);
      if (item.quantity <= item.minStockLevel) {
        eventService.emit(EventType.STOCK_ITEM_LOW, {
          itemId: item._id,
          currentQuantity: item.quantity,
          minQuantity: item.minStockLevel
        });
      }

      // For outgoing movements, release the token after successful creation
      if (data.type === 'out' && data.accessToken) {
        await stockAccessTokenService.releaseAccessToken(data.accessToken);
      }

      return result;
    } catch (error) {
      // If there was an error and we have a token, cancel it
      if (data.type === 'out' && data.accessToken) {
        try {
          await stockAccessTokenService.cancelAccessToken(data.accessToken);
        } catch (tokenError) {
          console.error('Error canceling access token:', tokenError);
        }
      }
      throw error;
    }
  }

  // Update updateMovement to use access token
  async updateMovement(id: string, data: Partial<StockMovement>): Promise<StockMovement> {
    try {
      // Request access token if updating quantity
      if (data.quantity) {
        const movement = await this.getMovement(id);
        if (movement.type === 'out') {
          await this.requestAccessToken(movement.inventoryItem.toString(), 'sale', data.quantity);
        }
      }

      const response = await api.patch(`/stock/movements/${id}`, data);
      const result = response.data.data;

      // Emit event for cross-module communication
      eventService.emit(EventType.STOCK_MOVEMENT_UPDATED, {
        movementId: result._id,
        itemId: result.inventoryItem,
        quantity: result.quantity,
        type: result.type,
        userId: result.user
      });

      return result;
    } catch (error) {
      this.handleError(error);
    } finally {
      // Release access token if it was requested
      if (data.quantity) {
        const movement = await this.getMovement(id);
        if (movement.type === 'out') {
          await this.releaseAccessToken(movement.inventoryItem.toString());
        }
      }
    }
  }

  async deleteMovement(id: string, reason: string, userId: string): Promise<void> {
    try {
      // Instead of deleting, change status to cancelled
      await statusManagementService.changeStatus(
        'stock_movements',
        id,
        'cancelled',
        'STOCK_MOVEMENT_CANCELLED',
        reason,
        userId
      );
      
      // Update the movement in the database
      await api.patch(`/stock/movements/${id}`, {
        status: 'cancelled',
        reason
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async cancelMovement(id: string, reason: string, userId: string): Promise<StockMovement> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'stock_movements',
        id,
        'cancelled',
        'STOCK_MOVEMENT_CANCELLED',
        reason,
        userId
      );
      
      // Update the movement in the database
      const response = await api.post(`/stock/movements/${id}/cancel`, { reason });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Purchase Orders
  async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const response = await api.get('/stock/purchase-orders');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    try {
      const response = await api.get(`/stock/purchase-orders/${id}`);
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
      const response = await api.post('/stock/purchase-orders', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to request purchase order access token
  async requestPurchaseOrderAccessToken(
    purchaseOrderId: string,
    operation: 'receive' | 'cancel' | 'approve',
    items?: { product: string; quantity: number }[]
  ): Promise<PurchaseOrderAccessToken> {
    try {
      const response = await api.post('/stock/purchase-orders/access-token', {
        purchaseOrder: purchaseOrderId,
        operation,
        items
      });
      
      const token = response.data.data.token;
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

  // Add method to release purchase order access token
  async releasePurchaseOrderAccessToken(purchaseOrderId: string): Promise<void> {
    const token = this.activePurchaseOrderTokens.get(purchaseOrderId);
    if (token) {
      try {
        await api.post(`/stock/purchase-orders/access-token/${token.token}/release`);
        this.activePurchaseOrderTokens.delete(purchaseOrderId);
      } catch (error) {
        console.error('Failed to release purchase order access token:', error);
      }
    }
  }

  // Update updatePurchaseOrderStatus to use access token
  async updatePurchaseOrderStatus(
    id: string,
    status: string,
    receivedItems?: { product: string; quantity: number }[]
  ): Promise<PurchaseOrder> {
    try {
      // Request access token for operations that require exclusive access
      let accessToken: string | undefined;
      if (['received', 'cancelled'].includes(status)) {
        const token = await this.requestPurchaseOrderAccessToken(
          id,
          status === 'received' ? 'receive' : 'cancel',
          receivedItems
        );
        accessToken = token.token;
      }

      const response = await api.patch(`/stock/purchase-orders/${id}/status`, {
        status,
        receivedItems,
        accessToken
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    } finally {
      // Release access token if it was requested
      if (['received', 'cancelled'].includes(status)) {
        await this.releasePurchaseOrderAccessToken(id);
      }
    }
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    try {
      await api.delete(`/stock/purchase-orders/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Inventory Items
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    try {
      const response = await api.get('/stock/inventory');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getInventoryItemById(id: string): Promise<InventoryItem> {
    try {
      const response = await api.get(`/stock/inventory/${id}`);
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
      const response = await api.post('/stock/inventory', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateInventoryItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    try {
      const response = await api.patch(`/stock/inventory/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteInventoryItem(id: string): Promise<void> {
    try {
      await api.delete(`/stock/inventory/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle stock item status changes
  async updateStockItemStatus(
    id: string, 
    newStatus: StockItemStatus, 
    reason: string, 
    userId: string
  ): Promise<InventoryItem> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'stock',
        id,
        newStatus,
        `STOCK_${newStatus.toUpperCase()}`,
        reason,
        userId
      );
      
      // Update the item in the database
      const response = await api.patch(`/stock/inventory/${id}`, {
        status: newStatus,
        reason
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle stock loss incidents
  async reportStockLoss(
    itemIds: string[], 
    incidentType: 'flood' | 'fire' | 'theft' | 'damage' | 'other',
    description: string,
    userId: string
  ): Promise<void> {
    try {
      // Determine the appropriate status based on incident type
      let status: StockItemStatus;
      let reasonCode: string;
      
      switch (incidentType) {
        case 'flood':
          status = StockItemStatus.DAMAGED;
          reasonCode = 'STOCK_FLOOD_DAMAGE';
          break;
        case 'fire':
          status = StockItemStatus.DAMAGED;
          reasonCode = 'STOCK_FIRE_DAMAGE';
          break;
        case 'theft':
          status = StockItemStatus.STOLEN;
          reasonCode = 'STOCK_THEFT';
          break;
        case 'damage':
          status = StockItemStatus.DAMAGED;
          reasonCode = 'STOCK_DAMAGE';
          break;
        default:
          status = StockItemStatus.LOST;
          reasonCode = 'STOCK_LOST';
      }
      
      // Update each affected item
      for (const itemId of itemIds) {
        await this.updateStockItemStatus(itemId, status, description, userId);
      }
      
      // Create a report of the incident
      await api.post('/stock/incidents', {
        type: incidentType,
        description,
        affectedItems: itemIds,
        reportedBy: userId,
        reportedAt: new Date()
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // Event Handlers
  private async handleExpenseApproved(data: {
    expenseId: string;
    amount: number;
    category: string;
    createdBy: string;
    departmentId: string;
  }): Promise<void> {
    try {
      if (data.category === 'stock') {
        // Update stock movement status if related
        const expense = await expenseTrackingService.getExpenses({ category: 'stock' });
        const relatedExpense = expense.find(e => e._id === data.expenseId);
        
        if (relatedExpense?.relatedItems) {
          for (const item of relatedExpense.relatedItems) {
            if (item.type === 'stock') {
              const movements = await this.getAllMovements({ inventoryItem: item.id });
              const pendingMovement = movements.find(m => m.status === 'pending');
              
              if (pendingMovement) {
                await this.updateMovement(pendingMovement._id, { status: 'completed' });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to handle expense approval:', error);
    }
  }
}

export const stockService = StockService.getInstance(); 