import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

export enum BackupType {
  FULL = 'full',
  INCREMENTAL = 'incremental',
  DIFFERENTIAL = 'differential'
}

export enum BackupStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface Backup {
  id: string;
  type: BackupType;
  status: BackupStatus;
  startTime: string;
  endTime?: string;
  size?: number;
  location: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface BackupSchedule {
  id: string;
  type: BackupType;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  location: string;
  retentionDays: number;
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  createdBy: string;
  createdAt: string;
}

class BackupService {
  private static instance: BackupService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.BACKUP_STARTED, this.handleBackupStarted);
    eventService.on(EventType.BACKUP_COMPLETED, this.handleBackupCompleted);
    eventService.on(EventType.BACKUP_FAILED, this.handleBackupFailed);
  }

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  async getBackups(): Promise<Backup[]> {
    const response = await api.get('/backups');
    return response.data;
  }

  async getBackup(id: string): Promise<Backup> {
    const response = await api.get(`/backups/${id}`);
    return response.data;
  }

  async createBackup(data: Omit<Backup, 'id' | 'status' | 'startTime' | 'endTime' | 'size' | 'createdBy' | 'createdAt'>): Promise<Backup> {
    const response = await api.post('/backups', data);
    return response.data;
  }

  async deleteBackup(id: string): Promise<void> {
    await api.delete(`/backups/${id}`);
  }

  async getSchedules(): Promise<BackupSchedule[]> {
    const response = await api.get('/backups/schedules');
    return response.data;
  }

  async getSchedule(id: string): Promise<BackupSchedule> {
    const response = await api.get(`/backups/schedules/${id}`);
    return response.data;
  }

  async createSchedule(data: Omit<BackupSchedule, 'id' | 'lastRun' | 'nextRun' | 'createdBy' | 'createdAt'>): Promise<BackupSchedule> {
    const response = await api.post('/backups/schedules', data);
    return response.data;
  }

  async updateSchedule(id: string, data: Partial<BackupSchedule>): Promise<BackupSchedule> {
    const response = await api.put(`/backups/schedules/${id}`, data);
    return response.data;
  }

  async deleteSchedule(id: string): Promise<void> {
    await api.delete(`/backups/schedules/${id}`);
  }

  async restoreBackup(id: string): Promise<void> {
    await api.post(`/backups/${id}/restore`);
  }

  private async handleBackupStarted(data: { backupId: string; startTime: string }): Promise<void> {
    try {
      await api.patch(`/backups/${data.backupId}`, {
        status: BackupStatus.IN_PROGRESS,
        startTime: data.startTime
      });
    } catch (error) {
      console.error('Failed to handle backup started:', error);
    }
  }

  private async handleBackupCompleted(data: { backupId: string; endTime: string; size: number }): Promise<void> {
    try {
      await api.patch(`/backups/${data.backupId}`, {
        status: BackupStatus.COMPLETED,
        endTime: data.endTime,
        size: data.size
      });
    } catch (error) {
      console.error('Failed to handle backup completed:', error);
    }
  }

  private async handleBackupFailed(data: { backupId: string; error: string }): Promise<void> {
    try {
      await api.patch(`/backups/${data.backupId}`, {
        status: BackupStatus.FAILED,
        notes: data.error
      });
    } catch (error) {
      console.error('Failed to handle backup failed:', error);
    }
  }
}

export const backupService = BackupService.getInstance(); 