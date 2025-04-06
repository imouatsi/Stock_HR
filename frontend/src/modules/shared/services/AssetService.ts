import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface Asset {
  id: string;
  name: string;
  code: string;
  description: string;
  type: string;
  category: string;
  status: AssetStatus;
  departmentId?: string;
  employeeId?: string;
  purchaseDate: string;
  purchasePrice: number;
  warrantyExpiry?: string;
  location: string;
  condition: AssetCondition;
  maintenanceHistory: MaintenanceRecord[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface AssetStats {
  totalAssets: number;
  activeAssets: number;
  assignedAssets: number;
  byType: Record<string, number>;
  byStatus: Record<AssetStatus, number>;
  byCondition: Record<AssetCondition, number>;
  totalValue: number;
  maintenance: {
    total: number;
    pending: number;
    completed: number;
  };
}

interface MaintenanceRecord {
  id: string;
  assetId: string;
  type: MaintenanceType;
  description: string;
  cost: number;
  performedBy: string;
  performedAt: string;
  nextMaintenance?: string;
  notes?: string;
}

enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED'
}

enum AssetCondition {
  NEW = 'NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  DAMAGED = 'DAMAGED'
}

enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  INSPECTION = 'INSPECTION',
  UPGRADE = 'UPGRADE'
}

class AssetService {
  private static instance: AssetService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): AssetService {
    if (!AssetService.instance) {
      AssetService.instance = new AssetService();
    }
    return AssetService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.ASSET_CREATED, this.handleAssetCreated.bind(this));
    eventService.on(EventType.ASSET_UPDATED, this.handleAssetUpdated.bind(this));
    eventService.on(EventType.ASSET_DELETED, this.handleAssetDeleted.bind(this));
    eventService.on(EventType.ASSET_ASSIGNED, this.handleAssetAssigned.bind(this));
    eventService.on(EventType.ASSET_STATUS_CHANGED, this.handleAssetStatusChanged.bind(this));
  }

  private async handleAssetCreated(data: { assetId: string; name: string }): Promise<void> {
    try {
      console.log(`Asset created: ${data.name}`);
    } catch (error) {
      console.error('Error handling asset creation:', error);
    }
  }

  private async handleAssetUpdated(data: { assetId: string; changes: Partial<{ name: string; code: string }> }): Promise<void> {
    try {
      console.log(`Asset updated: ${data.assetId}`, data.changes);
    } catch (error) {
      console.error('Error handling asset update:', error);
    }
  }

  private async handleAssetDeleted(data: { assetId: string }): Promise<void> {
    try {
      console.log(`Asset deleted: ${data.assetId}`);
    } catch (error) {
      console.error('Error handling asset deletion:', error);
    }
  }

  private async handleAssetAssigned(data: { assetId: string; employeeId: string }): Promise<void> {
    try {
      console.log(`Asset ${data.assetId} assigned to employee ${data.employeeId}`);
    } catch (error) {
      console.error('Error handling asset assignment:', error);
    }
  }

  private async handleAssetStatusChanged(data: { assetId: string; oldStatus: AssetStatus; newStatus: AssetStatus }): Promise<void> {
    try {
      console.log(`Asset ${data.assetId} status changed from ${data.oldStatus} to ${data.newStatus}`);
    } catch (error) {
      console.error('Error handling asset status change:', error);
    }
  }

  public async getAssets(): Promise<Asset[]> {
    const response = await api.get('/assets');
    return response.data;
  }

  public async getAsset(id: string): Promise<Asset> {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  }

  public async createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    const response = await api.post('/assets', asset);
    return response.data;
  }

  public async updateAsset(id: string, changes: Partial<Asset>): Promise<Asset> {
    const response = await api.patch(`/assets/${id}`, changes);
    return response.data;
  }

  public async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  }

  public async getAssetStats(): Promise<AssetStats> {
    const response = await api.get('/assets/stats');
    return response.data;
  }

  public async getDepartmentAssets(departmentId: string): Promise<Asset[]> {
    const response = await api.get(`/assets/department/${departmentId}`);
    return response.data;
  }

  public async getEmployeeAssets(employeeId: string): Promise<Asset[]> {
    const response = await api.get(`/assets/employee/${employeeId}`);
    return response.data;
  }

  public async assignAsset(assetId: string, employeeId: string): Promise<void> {
    await api.post(`/assets/${assetId}/assign`, { employeeId });
  }

  public async unassignAsset(assetId: string): Promise<void> {
    await api.post(`/assets/${assetId}/unassign`);
  }

  public async getMaintenanceHistory(assetId: string): Promise<MaintenanceRecord[]> {
    const response = await api.get(`/assets/${assetId}/maintenance`);
    return response.data;
  }

  public async addMaintenanceRecord(assetId: string, record: Omit<MaintenanceRecord, 'id' | 'assetId'>): Promise<MaintenanceRecord> {
    const response = await api.post(`/assets/${assetId}/maintenance`, record);
    return response.data;
  }

  public async updateMaintenanceRecord(assetId: string, recordId: string, changes: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const response = await api.patch(`/assets/${assetId}/maintenance/${recordId}`, changes);
    return response.data;
  }

  public async deleteMaintenanceRecord(assetId: string, recordId: string): Promise<void> {
    await api.delete(`/assets/${assetId}/maintenance/${recordId}`);
  }
}

export const assetService = AssetService.getInstance(); 