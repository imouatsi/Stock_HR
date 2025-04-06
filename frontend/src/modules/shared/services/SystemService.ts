import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface SystemInfo {
  version: string;
  environment: string;
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
  };
}

interface SystemComponentStatus {
  component: SystemComponent;
  status: SystemStatus;
  lastCheck: string;
  error?: string;
  metrics: Record<string, any>;
}

interface SystemAlert {
  id: string;
  component: SystemComponent;
  level: AlertLevel;
  message: string;
  timestamp: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

enum SystemStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  DEGRADED = 'DEGRADED',
  ERROR = 'ERROR'
}

enum SystemComponent {
  API = 'API',
  DATABASE = 'DATABASE',
  CACHE = 'CACHE',
  STORAGE = 'STORAGE',
  AUTH = 'AUTH',
  NOTIFICATION = 'NOTIFICATION',
  BACKUP = 'BACKUP',
  SCHEDULER = 'SCHEDULER'
}

enum AlertLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

class SystemService {
  private static instance: SystemService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): SystemService {
    if (!SystemService.instance) {
      SystemService.instance = new SystemService();
    }
    return SystemService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.SYSTEM_STATUS_CHANGED, this.handleSystemStatusChanged.bind(this));
    eventService.on(EventType.SYSTEM_ALERT_CREATED, this.handleSystemAlertCreated.bind(this));
  }

  private async handleSystemStatusChanged(data: { component: SystemComponent; oldStatus: SystemStatus; newStatus: SystemStatus }): Promise<void> {
    try {
      console.log(`System component ${data.component} status changed from ${data.oldStatus} to ${data.newStatus}`);
    } catch (error) {
      console.error('Error handling system status change:', error);
    }
  }

  private async handleSystemAlertCreated(data: { alertId: string; component: SystemComponent; level: AlertLevel }): Promise<void> {
    try {
      console.log(`System alert created: ${data.level} for component ${data.component}`);
    } catch (error) {
      console.error('Error handling system alert creation:', error);
    }
  }

  public async getSystemInfo(): Promise<SystemInfo> {
    const response = await api.get('/system/info');
    return response.data;
  }

  public async getComponentStatuses(): Promise<SystemComponentStatus[]> {
    const response = await api.get('/system/components');
    return response.data;
  }

  public async getComponentStatus(component: SystemComponent): Promise<SystemComponentStatus> {
    const response = await api.get(`/system/components/${component}`);
    return response.data;
  }

  public async getSystemAlerts(): Promise<SystemAlert[]> {
    const response = await api.get('/system/alerts');
    return response.data;
  }

  public async getSystemMetrics(): Promise<Record<string, any>> {
    const response = await api.get('/system/metrics');
    return response.data;
  }

  public async createSystemAlert(alert: Omit<SystemAlert, 'id' | 'timestamp'>): Promise<SystemAlert> {
    const response = await api.post('/system/alerts', alert);
    return response.data;
  }

  public async resolveSystemAlert(id: string): Promise<void> {
    await api.post(`/system/alerts/${id}/resolve`);
  }

  public async getSystemLogs(): Promise<string[]> {
    const response = await api.get('/system/logs');
    return response.data;
  }

  public async getSystemConfig(): Promise<Record<string, any>> {
    const response = await api.get('/system/config');
    return response.data;
  }

  public async updateSystemConfig(config: Record<string, any>): Promise<void> {
    await api.patch('/system/config', config);
  }

  public async restartSystem(): Promise<void> {
    await api.post('/system/restart');
  }

  public async shutdownSystem(): Promise<void> {
    await api.post('/system/shutdown');
  }

  public async startMaintenance(): Promise<void> {
    await api.post('/system/maintenance/start');
  }

  public async endMaintenance(): Promise<void> {
    await api.post('/system/maintenance/end');
  }
}

export const systemService = SystemService.getInstance(); 