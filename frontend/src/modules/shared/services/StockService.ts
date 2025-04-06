import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface StockItem {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  cost: number;
  price: number;
  location: string;
  supplier: string;
  status: StockStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface StockMovement {
  id: string;
  itemId: string;
  type: MovementType;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason: string;
  reference?: string;
  performedBy: string;
  performedAt: string;
  notes?: string;
}

interface StockStats {
  totalItems: number;
  activeItems: number;
  totalValue: number;
  byCategory: Record<string, number>;
  byStatus: Record<StockStatus, number>;
  lowStock: number;
  outOfStock: number;
  movements: {
    total: number;
    in: number;
    out: number;
    transfer: number;
  };
}

enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED'
}

enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT'
}

class StockService {
  private static instance: StockService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.STOCK_MOVEMENT_CREATED, this.handleStockMovementCreated.bind(this));
    eventService.on(EventType.STOCK_ITEM_STATUS_CHANGED, this.handleStockItemStatusChanged.bind(this));
    eventService.on(EventType.STOCK_ITEM_UPDATED, this.handleStockItemUpdated.bind(this));
    eventService.on(EventType.STOCK_ITEM_DELETED, this.handleStockItemDeleted.bind(this));
  }

  private async handleStockMovementCreated(data: { movementId: string; itemId: string; type: MovementType }): Promise<void> {
    try {
      console.log(`Stock movement created: ${data.type} for item ${data.itemId}`);
    } catch (error) {
      console.error('Error handling stock movement creation:', error);
    }
  }

  private async handleStockItemStatusChanged(data: { itemId: string; oldStatus: StockStatus; newStatus: StockStatus }): Promise<void> {
    try {
      console.log(`Stock item ${data.itemId} status changed from ${data.oldStatus} to ${data.newStatus}`);
    } catch (error) {
      console.error('Error handling stock item status change:', error);
    }
  }

  private async handleStockItemUpdated(data: { itemId: string; changes: Partial<{ name: string; code: string }> }): Promise<void> {
    try {
      console.log(`Stock item updated: ${data.itemId}`, data.changes);
    } catch (error) {
      console.error('Error handling stock item update:', error);
    }
  }

  private async handleStockItemDeleted(data: { itemId: string }): Promise<void> {
    try {
      console.log(`Stock item deleted: ${data.itemId}`);
    } catch (error) {
      console.error('Error handling stock item deletion:', error);
    }
  }

  public async getStockItems(): Promise<StockItem[]> {
    const response = await api.get('/stock/items');
    return response.data;
  }

  public async getStockItem(id: string): Promise<StockItem> {
    const response = await api.get(`/stock/items/${id}`);
    return response.data;
  }

  public async createStockItem(item: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<StockItem> {
    const response = await api.post('/stock/items', item);
    return response.data;
  }

  public async updateStockItem(id: string, changes: Partial<StockItem>): Promise<StockItem> {
    const response = await api.patch(`/stock/items/${id}`, changes);
    return response.data;
  }

  public async deleteStockItem(id: string): Promise<void> {
    await api.delete(`/stock/items/${id}`);
  }

  public async getStockStats(): Promise<StockStats> {
    const response = await api.get('/stock/stats');
    return response.data;
  }

  public async getStockMovements(itemId?: string): Promise<StockMovement[]> {
    const response = await api.get('/stock/movements', { params: { itemId } });
    return response.data;
  }

  public async createStockMovement(movement: Omit<StockMovement, 'id' | 'performedAt'>): Promise<StockMovement> {
    const response = await api.post('/stock/movements', movement);
    return response.data;
  }

  public async getLowStockItems(): Promise<StockItem[]> {
    const response = await api.get('/stock/items/low-stock');
    return response.data;
  }

  public async getOutOfStockItems(): Promise<StockItem[]> {
    const response = await api.get('/stock/items/out-of-stock');
    return response.data;
  }

  public async getStockByCategory(category: string): Promise<StockItem[]> {
    const response = await api.get(`/stock/items/category/${category}`);
    return response.data;
  }

  public async getStockByLocation(location: string): Promise<StockItem[]> {
    const response = await api.get(`/stock/items/location/${location}`);
    return response.data;
  }

  public async transferStock(itemId: string, quantity: number, fromLocation: string, toLocation: string, reason: string): Promise<void> {
    await api.post('/stock/transfer', {
      itemId,
      quantity,
      fromLocation,
      toLocation,
      reason
    });
  }

  public async adjustStock(itemId: string, quantity: number, reason: string): Promise<void> {
    await api.post('/stock/adjust', {
      itemId,
      quantity,
      reason
    });
  }
}

export const stockService = StockService.getInstance(); 