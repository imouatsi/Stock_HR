import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export enum LogSource {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  API = 'api',
  AUTH = 'auth',
  SYSTEM = 'system'
}

export interface Log {
  id: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  timestamp: string;
  userId?: string;
  userIp?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
}

export interface LogFilter {
  level?: LogLevel;
  source?: LogSource;
  userId?: string;
  startDate?: string;
  endDate?: string;
  message?: string;
}

class LoggingService {
  private static instance: LoggingService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.LOG_CREATED, this.handleLogCreated);
  }

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  async getLogs(filter?: LogFilter): Promise<Log[]> {
    const response = await api.get('/logs', { params: filter });
    return response.data;
  }

  async getLog(id: string): Promise<Log> {
    const response = await api.get(`/logs/${id}`);
    return response.data;
  }

  async createLog(data: Omit<Log, 'id' | 'timestamp'>): Promise<Log> {
    const response = await api.post('/logs', data);
    return response.data;
  }

  async deleteLog(id: string): Promise<void> {
    await api.delete(`/logs/${id}`);
  }

  async clearLogs(filter?: LogFilter): Promise<void> {
    await api.delete('/logs', { params: filter });
  }

  async exportLogs(filter?: LogFilter): Promise<Blob> {
    const response = await api.get('/logs/export', {
      params: filter,
      responseType: 'blob'
    });
    return response.data;
  }

  private async handleLogCreated(data: { log: Log }): Promise<void> {
    try {
      // Handle log created event
      console.log('Log created:', data.log);
    } catch (error) {
      console.error('Failed to handle log created:', error);
    }
  }
}

export const loggingService = LoggingService.getInstance(); 