import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

export enum DashboardType {
  HR = 'hr',
  FINANCE = 'finance',
  INVENTORY = 'inventory',
  ASSET = 'asset',
  SYSTEM = 'system'
}

export interface Dashboard {
  id: string;
  type: DashboardType;
  name: string;
  description?: string;
  layout: Record<string, any>;
  widgets: string[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface Widget {
  id: string;
  type: string;
  name: string;
  description?: string;
  config: Record<string, any>;
  data?: Record<string, any>;
  refreshInterval?: number;
  lastRefreshed?: string;
}

export interface DashboardData {
  employees: {
    total: number;
    active: number;
    inactive: number;
    byDepartment: Record<string, number>;
    byPosition: Record<string, number>;
  };
  assets: {
    total: number;
    assigned: number;
    available: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  stock: {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
  };
  finance: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    byCategory: Record<string, number>;
    byMonth: Record<string, number>;
  };
  system: {
    users: number;
    backups: number;
    storage: number;
    uptime: number;
  };
}

class DashboardService {
  private static instance: DashboardService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.DASHBOARD_UPDATED, this.handleDashboardUpdated);
  }

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getDashboards(): Promise<Dashboard[]> {
    const response = await api.get('/dashboards');
    return response.data;
  }

  async getDashboard(id: string): Promise<Dashboard> {
    const response = await api.get(`/dashboards/${id}`);
    return response.data;
  }

  async createDashboard(data: Omit<Dashboard, 'id' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>): Promise<Dashboard> {
    const response = await api.post('/dashboards', data);
    return response.data;
  }

  async updateDashboard(id: string, data: Partial<Dashboard>): Promise<Dashboard> {
    const response = await api.put(`/dashboards/${id}`, data);
    return response.data;
  }

  async deleteDashboard(id: string): Promise<void> {
    await api.delete(`/dashboards/${id}`);
  }

  async getWidgets(): Promise<Widget[]> {
    const response = await api.get('/dashboards/widgets');
    return response.data;
  }

  async getWidget(id: string): Promise<Widget> {
    const response = await api.get(`/dashboards/widgets/${id}`);
    return response.data;
  }

  async createWidget(data: Omit<Widget, 'id' | 'lastRefreshed'>): Promise<Widget> {
    const response = await api.post('/dashboards/widgets', data);
    return response.data;
  }

  async updateWidget(id: string, data: Partial<Widget>): Promise<Widget> {
    const response = await api.put(`/dashboards/widgets/${id}`, data);
    return response.data;
  }

  async deleteWidget(id: string): Promise<void> {
    await api.delete(`/dashboards/widgets/${id}`);
  }

  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get('/dashboards/data');
    return response.data;
  }

  async refreshWidget(id: string): Promise<Widget> {
    const response = await api.post(`/dashboards/widgets/${id}/refresh`);
    return response.data;
  }

  private async handleDashboardUpdated(data: { dashboard: Dashboard }): Promise<void> {
    try {
      // Handle dashboard updated event
      console.log('Dashboard updated:', data.dashboard);
    } catch (error) {
      console.error('Failed to handle dashboard updated:', error);
    }
  }
}

export const dashboardService = DashboardService.getInstance(); 