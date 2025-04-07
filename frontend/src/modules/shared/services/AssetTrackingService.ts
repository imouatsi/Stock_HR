import { api } from '../../services/api';
import { eventService, EventType } from './EventService';
import { statusManagementService } from './StatusManagementService';

export enum AssetStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
  LOST = 'lost',
  STOLEN = 'stolen',
  DAMAGED = 'damaged'
}

export enum AssetType {
  LAPTOP = 'laptop',
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  PRINTER = 'printer',
  SERVER = 'server',
  NETWORK = 'network',
  OTHER = 'other'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  model: string;
  manufacturer: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  status: AssetStatus;
  location: string;
  notes?: string;
  assignedTo?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  employeeId: string;
  assignedBy: string;
  assignedDate: string;
  returnedDate?: string;
  notes?: string;
}

class AssetTrackingService {
  private static instance: AssetTrackingService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.EMPLOYEE_TERMINATED, this.handleEmployeeTermination);
  }

  public static getInstance(): AssetTrackingService {
    if (!AssetTrackingService.instance) {
      AssetTrackingService.instance = new AssetTrackingService();
    }
    return AssetTrackingService.instance;
  }

  async getAssets(): Promise<Asset[]> {
    const response = await api.get('/assets');
    return response.data;
  }

  async getAsset(id: string): Promise<Asset> {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  }

  async createAsset(data: Omit<Asset, 'id' | 'status' | 'assignedTo'>): Promise<Asset> {
    const response = await api.post('/assets', data);
    return response.data;
  }

  async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
    const response = await api.put(`/assets/${id}`, data);
    return response.data;
  }

  async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  }

  async getAssignments(): Promise<AssetAssignment[]> {
    const response = await api.get('/assets/assignments');
    return response.data;
  }

  async getAssignment(id: string): Promise<AssetAssignment> {
    const response = await api.get(`/assets/assignments/${id}`);
    return response.data;
  }

  async assignAsset(data: Omit<AssetAssignment, 'id' | 'returnedDate'>): Promise<AssetAssignment> {
    const response = await api.post('/assets/assignments', data);
    return response.data;
  }

  async returnAsset(id: string, notes?: string): Promise<AssetAssignment> {
    const response = await api.patch(`/assets/assignments/${id}/return`, { notes });
    return response.data;
  }

  async updateAssetStatus(
    id: string,
    newStatus: AssetStatus,
    reason: string,
    userId: string
  ): Promise<void> {
    try {
      await statusManagementService.changeStatus(
        id,
        'asset',
        newStatus,
        `ASSET_${newStatus.toUpperCase()}`,
        reason,
        userId
      );

      await api.patch(`/assets/${id}`, {
        status: newStatus,
        reason
      });
    } catch (error) {
      console.error('Failed to update asset status:', error);
      throw error;
    }
  }

  private async handleEmployeeTermination(data: { employeeId: string; terminationDate: string }): Promise<void> {
    try {
      // Get all assets assigned to the terminated employee
      const assignments = await this.getAssignments();
      const employeeAssignments = assignments.filter(
        assignment => assignment.employeeId === data.employeeId && !assignment.returnedDate
      );

      // Return all assigned assets
      for (const assignment of employeeAssignments) {
        await this.returnAsset(assignment.id, 'Asset returned due to employee termination');
      }
    } catch (error) {
      console.error('Failed to handle employee termination:', error);
    }
  }
}

export const assetTrackingService = AssetTrackingService.getInstance(); 