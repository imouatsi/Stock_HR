import { api } from '@/lib/api';

export type AuditAction =
  | 'CREATE_DOCUMENT'
  | 'UPDATE_DOCUMENT'
  | 'DELETE_DOCUMENT'
  | 'APPROVE_DOCUMENT'
  | 'REJECT_DOCUMENT'
  | 'CREATE_USER'
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'LOGIN'
  | 'LOGOUT';

export type AuditEntity = 'Document' | 'User' | 'System';

export const auditService = {
  async logAction(
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await api.post('/audit/logs', {
        action,
        entity,
        entityId,
        metadata,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error logging audit action:', error);
      // Don't throw error to prevent blocking the main action
    }
  },

  async getAuditLogs(params?: {
    action?: AuditAction;
    entity?: AuditEntity;
    entityId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: Array<{
      id: string;
      action: AuditAction;
      entity: AuditEntity;
      entityId: string;
      metadata: Record<string, any>;
      timestamp: string;
      userId: string;
    }>;
    total: number;
  }> {
    try {
      const response = await api.get('/audit/logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  },
}; 