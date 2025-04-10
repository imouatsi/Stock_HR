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
      return {
        warehouses: response.data.data.warehouses,
        pagination: {
          totalDocs: response.data.totalDocs,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          limit: response.data.limit
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
      return response.data.data.warehouse;
    } catch (error) {
      console.error(`Error fetching warehouse with ID ${id}:`, error);
      throw error;
    }
  }

  async createWarehouse(warehouseData: WarehouseInput): Promise<Warehouse> {
    try {
      const response = await apiService.post('/v2/warehouses', warehouseData);
      return response.data.data.warehouse;
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }

  async updateWarehouse(id: string, warehouseData: Partial<WarehouseInput>): Promise<Warehouse> {
    try {
      const response = await apiService.patch(`/v2/warehouses/${id}`, warehouseData);
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
      return response.data.data.warehouses;
    } catch (error) {
      console.error(`Error fetching warehouses for manager ${managerId}:`, error);
      throw error;
    }
  }
}

export const warehouseService = WarehouseService.getInstance();
