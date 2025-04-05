import api from './api';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: string;
  location: string;
  reorderPoint: number;
  supplier?: string;
  lastRestocked?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  status: string;
  data: {
    items?: T[];
    item?: T;
  };
}

class InventoryService {
  private static instance: InventoryService;

  private constructor() {}

  public static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  public async getAllItems(): Promise<InventoryItem[]> {
    try {
      const response = await api.get<ApiResponse<InventoryItem>>('/inventory'); // Ensure `api.get` is valid
      return response.data.data.items || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getItemById(id: string): Promise<InventoryItem> {
    try {
      const response = await api.get<ApiResponse<InventoryItem>>(`/inventory/${id}`);
      if (!response.data.data.item) {
        throw new Error('Item not found');
      }
      return response.data.data.item;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async createItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    try {
      const response = await api.post<ApiResponse<InventoryItem>>('/inventory', item);
      if (!response.data.data.item) {
        throw new Error('Failed to create item');
      }
      return response.data.data.item;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async updateItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
    try {
      const response = await api.put<ApiResponse<InventoryItem>>(`/inventory/${id}`, item);
      if (!response.data.data.item) {
        throw new Error('Failed to update item');
      }
      return response.data.data.item;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async deleteItem(id: string): Promise<void> {
    try {
      const response = await api.delete(`/inventory/${id}`);
      if (!response.data.success) {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async updateQuantity(id: string, quantity: number): Promise<InventoryItem> {
    try {
      const response = await api.patch<ApiResponse<InventoryItem>>(`/inventory/${id}/quantity`, { quantity });
      if (!response.data.data.item) {
        throw new Error('Failed to update quantity');
      }
      return response.data.data.item;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data.message || 'An error occurred';
      return new Error(message);
    }
    return new Error('Network error occurred');
  }
}

export default InventoryService.getInstance();