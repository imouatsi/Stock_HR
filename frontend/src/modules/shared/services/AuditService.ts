import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  APPROVE = 'approve',
  REJECT = 'reject',
  EXPORT = 'export',
  IMPORT = 'import'
}

export enum AuditEntity {
  USER = 'user',
  EMPLOYEE = 'employee',
  DEPARTMENT = 'department',
  POSITION = 'position',
  ASSET = 'asset',
  STOCK = 'stock',
  INVOICE = 'invoice',
  EXPENSE = 'expense',
  BACKUP = 'backup',
  SETTING = 'setting'
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  userId: string;
  userIp: string;
  userAgent: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface AuditFilter {
  action?: AuditAction;
  entity?: AuditEntity;
  entityId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

class AuditService {
  private static instance: AuditService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.AUDIT_LOG_CREATED, this.handleAuditLogCreated);
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  async getAuditLogs(filter?: AuditFilter): Promise<AuditLog[]> {
    const response = await api.get('/audit/logs', { params: filter });
    return response.data;
  }

  async getAuditLog(id: string): Promise<AuditLog> {
    const response = await api.get(`/audit/logs/${id}`);
    return response.data;
  }

  async createAuditLog(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const response = await api.post('/audit/logs', data);
    return response.data;
  }

  async exportAuditLogs(filter?: AuditFilter): Promise<Blob> {
    const response = await api.get('/audit/logs/export', {
      params: filter,
      responseType: 'blob'
    });
    return response.data;
  }

  private async handleAuditLogCreated(data: { auditLog: AuditLog }): Promise<void> {
    try {
      // Handle audit log created event
      console.log('Audit log created:', data.auditLog);
    } catch (error) {
      console.error('Failed to handle audit log created:', error);
    }
  }
}

export const auditService = AuditService.getInstance(); 