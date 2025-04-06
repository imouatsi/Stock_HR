import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  level: SecurityLevel;
  message: string;
  userId: string;
  userIp: string;
  userAgent: string;
  metadata: Record<string, any>;
  timestamp: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  type: string;
  level: SecurityLevel;
  action: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

interface SecurityAlert {
  id: string;
  eventId: string;
  policyId: string;
  status: AlertStatus;
  assignedTo?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

enum SecurityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

enum SecurityEventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  ACCESS_DENIED = 'ACCESS_DENIED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  MALWARE_DETECTED = 'MALWARE_DETECTED',
  DATA_BREACH = 'DATA_BREACH',
  SYSTEM_COMPROMISE = 'SYSTEM_COMPROMISE'
}

enum AlertStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

class SecurityService {
  private static instance: SecurityService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.SECURITY_EVENT_CREATED, this.handleSecurityEventCreated.bind(this));
    eventService.on(EventType.SECURITY_ALERT_CREATED, this.handleSecurityAlertCreated.bind(this));
  }

  private async handleSecurityEventCreated(data: { eventId: string; type: SecurityEventType; level: SecurityLevel }): Promise<void> {
    try {
      console.log(`Security event created: ${data.type} (${data.level})`);
    } catch (error) {
      console.error('Error handling security event creation:', error);
    }
  }

  private async handleSecurityAlertCreated(data: { alertId: string; eventId: string; policyId: string }): Promise<void> {
    try {
      console.log(`Security alert created for event ${data.eventId} and policy ${data.policyId}`);
    } catch (error) {
      console.error('Error handling security alert creation:', error);
    }
  }

  public async getSecurityEvents(): Promise<SecurityEvent[]> {
    const response = await api.get('/security/events');
    return response.data;
  }

  public async getSecurityEvent(id: string): Promise<SecurityEvent> {
    const response = await api.get(`/security/events/${id}`);
    return response.data;
  }

  public async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<SecurityEvent> {
    const response = await api.post('/security/events', event);
    return response.data;
  }

  public async getSecurityPolicies(): Promise<SecurityPolicy[]> {
    const response = await api.get('/security/policies');
    return response.data;
  }

  public async getSecurityPolicy(id: string): Promise<SecurityPolicy> {
    const response = await api.get(`/security/policies/${id}`);
    return response.data;
  }

  public async createSecurityPolicy(policy: Omit<SecurityPolicy, 'id' | 'createdAt' | 'updatedAt'>): Promise<SecurityPolicy> {
    const response = await api.post('/security/policies', policy);
    return response.data;
  }

  public async updateSecurityPolicy(id: string, changes: Partial<SecurityPolicy>): Promise<SecurityPolicy> {
    const response = await api.patch(`/security/policies/${id}`, changes);
    return response.data;
  }

  public async deleteSecurityPolicy(id: string): Promise<void> {
    await api.delete(`/security/policies/${id}`);
  }

  public async getSecurityAlerts(): Promise<SecurityAlert[]> {
    const response = await api.get('/security/alerts');
    return response.data;
  }

  public async getSecurityAlert(id: string): Promise<SecurityAlert> {
    const response = await api.get(`/security/alerts/${id}`);
    return response.data;
  }

  public async createSecurityAlert(alert: Omit<SecurityAlert, 'id' | 'createdAt' | 'updatedAt'>): Promise<SecurityAlert> {
    const response = await api.post('/security/alerts', alert);
    return response.data;
  }

  public async updateSecurityAlert(id: string, changes: Partial<SecurityAlert>): Promise<SecurityAlert> {
    const response = await api.patch(`/security/alerts/${id}`, changes);
    return response.data;
  }

  public async assignSecurityAlert(id: string, assignedTo: string): Promise<void> {
    await api.post(`/security/alerts/${id}/assign`, { assignedTo });
  }

  public async resolveSecurityAlert(id: string, notes: string): Promise<void> {
    await api.post(`/security/alerts/${id}/resolve`, { notes });
  }

  public async getSecurityLogs(): Promise<string[]> {
    const response = await api.get('/security/logs');
    return response.data;
  }

  public async getSecurityMetrics(): Promise<Record<string, any>> {
    const response = await api.get('/security/metrics');
    return response.data;
  }

  public async getSecurityConfig(): Promise<Record<string, any>> {
    const response = await api.get('/security/config');
    return response.data;
  }

  public async updateSecurityConfig(config: Record<string, any>): Promise<void> {
    await api.patch('/security/config', config);
  }
}

export const securityService = SecurityService.getInstance(); 