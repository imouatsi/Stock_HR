import { api } from '../../../services/api';
import { eventService, EventType } from './EventService';

export interface AssetAssignment {
  _id: string;
  assetId: string;
  employeeId: string;
  assignedBy: string;
  assignedDate: Date;
  returnDate?: Date;
  status: 'assigned' | 'returned' | 'lost';
  notes?: string;
}

export interface Asset {
  _id: string;
  name: string;
  type: string;
  serialNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  location?: string;
  assignedTo?: string;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
}

class AssetTrackingService {
  private static instance: AssetTrackingService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.EMPLOYEE_DELETED, this.handleEmployeeDeleted);
    eventService.on(EventType.STOCK_ITEM_OUT, this.handleStockItemOut);
  }

  public static getInstance(): AssetTrackingService {
    if (!AssetTrackingService.instance) {
      AssetTrackingService.instance = new AssetTrackingService();
    }
    return AssetTrackingService.instance;
  }

  // Asset Management
  async getAllAssets(): Promise<Asset[]> {
    try {
      const response = await api.get('/assets');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      throw error;
    }
  }

  async getAssetById(id: string): Promise<Asset> {
    try {
      const response = await api.get(`/assets/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch asset:', error);
      throw error;
    }
  }

  async createAsset(data: Partial<Asset>): Promise<Asset> {
    try {
      const response = await api.post('/assets', data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create asset:', error);
      throw error;
    }
  }

  async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
    try {
      const response = await api.patch(`/assets/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update asset:', error);
      throw error;
    }
  }

  // Asset Assignment
  async assignAsset(assignment: Partial<AssetAssignment>): Promise<AssetAssignment> {
    try {
      const response = await api.post('/assets/assign', assignment);
      const result = response.data.data;
      
      // Emit event for cross-module communication
      eventService.emit(EventType.ASSET_ASSIGNED, {
        assetId: result.assetId,
        employeeId: result.employeeId,
        assignedBy: result.assignedBy,
        assignedDate: result.assignedDate
      });
      
      return result;
    } catch (error) {
      console.error('Failed to assign asset:', error);
      throw error;
    }
  }

  async returnAsset(assignmentId: string, notes?: string): Promise<AssetAssignment> {
    try {
      const response = await api.post(`/assets/return/${assignmentId}`, { notes });
      const result = response.data.data;
      
      // Emit event for cross-module communication
      eventService.emit(EventType.ASSET_RETURNED, {
        assetId: result.assetId,
        employeeId: result.employeeId,
        assignedBy: result.assignedBy,
        assignedDate: result.assignedDate
      });
      
      return result;
    } catch (error) {
      console.error('Failed to return asset:', error);
      throw error;
    }
  }

  async getAssetAssignments(filters?: {
    assetId?: string;
    employeeId?: string;
    status?: 'assigned' | 'returned' | 'lost';
  }): Promise<AssetAssignment[]> {
    try {
      const response = await api.get('/assets/assignments', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch asset assignments:', error);
      throw error;
    }
  }

  // Event Handlers
  private async handleEmployeeDeleted(data: { employeeId: string }): Promise<void> {
    try {
      // Find all assets assigned to the deleted employee
      const assignments = await this.getAssetAssignments({
        employeeId: data.employeeId,
        status: 'assigned'
      });

      // Return all assigned assets
      for (const assignment of assignments) {
        await this.returnAsset(assignment._id, 'Employee deleted');
      }
    } catch (error) {
      console.error('Failed to handle employee deletion:', error);
    }
  }

  private async handleStockItemOut(data: { itemId: string; quantity: number }): Promise<void> {
    try {
      // Check if the item is an asset
      const asset = await this.getAssetById(data.itemId);
      if (asset) {
        // Update asset status
        await this.updateAsset(data.itemId, {
          status: 'assigned',
          currentValue: asset.currentValue * (1 - 0.1) // Depreciate by 10%
        });
      }
    } catch (error) {
      console.error('Failed to handle stock item out:', error);
    }
  }
}

export const assetTrackingService = AssetTrackingService.getInstance(); 