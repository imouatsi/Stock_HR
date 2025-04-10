import apiService from './api.service';
import { Warehouse, WarehouseInput, WarehouseFilters } from '../types/warehouse';

class WarehouseService {
  private static instance: WarehouseService;

  private constructor() {}

  public static getInstance(): WarehouseService {
    if (!WarehouseService.instance) {
      WarehouseService.instance = new WarehouseService();
    }
    return WarehouseService.instance;
  }

  async getAllWarehouses(filters: WarehouseFilters = {}): Promise<{
    warehouses: Warehouse[];
    pagination: {
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  }> {
    try {
      const response = await apiService.get('/v2/warehouses', { params: filters });

      if (!response.data || !response.data.data) {
        throw new Error('API response missing data structure');
      }

      return {
        warehouses: response.data.data.warehouses || [],
        pagination: {
          totalDocs: response.data.totalDocs || 0,
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1,
          limit: response.data.limit || 10
        }
      };
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      throw error;
    }
  }

  async getWarehouseById(id: string): Promise<Warehouse> {
    try {
      const response = await apiService.get(`/v2/warehouses/${id}`);

      if (!response.data || !response.data.data || !response.data.data.warehouse) {
        throw new Error(`API response missing data structure for warehouse ID ${id}`);
      }

      return response.data.data.warehouse;
    } catch (error) {
      console.error(`Error fetching warehouse with ID ${id}:`, error);
      throw error;
    }
  }

  async createWarehouse(warehouseData: WarehouseInput): Promise<Warehouse> {
    try {
      const response = await apiService.post('/v2/warehouses', warehouseData);

      if (!response.data || !response.data.data || !response.data.data.warehouse) {
        throw new Error('API response missing data structure for warehouse creation');
      }

      return response.data.data.warehouse;
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }

  async updateWarehouse(id: string, warehouseData: Partial<WarehouseInput>): Promise<Warehouse> {
    try {
      const response = await apiService.patch(`/v2/warehouses/${id}`, warehouseData);

      if (!response.data || !response.data.data || !response.data.data.warehouse) {
        throw new Error(`API response missing data structure for warehouse update ID ${id}`);
      }

      return response.data.data.warehouse;
    } catch (error) {
      console.error(`Error updating warehouse with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteWarehouse(id: string): Promise<void> {
    try {
      await apiService.delete(`/v2/warehouses/${id}`);
    } catch (error) {
      console.error(`Error deleting warehouse with ID ${id}:`, error);
      throw error;
    }
  }

  async getWarehousesByManager(managerId: string): Promise<Warehouse[]> {
    try {
      const response = await apiService.get(`/v2/warehouses/manager/${managerId}`);
      if (!response.data || !response.data.data || !response.data.data.warehouses) {
        throw new Error(`API response missing data structure for manager ${managerId}`);
      }
      return response.data.data.warehouses;
    } catch (error) {
      console.error(`Error fetching warehouses for manager ${managerId}:`, error);
      throw error;
    }
  }
}

export const warehouseService = WarehouseService.getInstance();
