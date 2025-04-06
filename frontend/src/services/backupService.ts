import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { app, ipcRenderer } from 'electron';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';

const execAsync = promisify(exec);

export interface BackupConfig {
  enabled: boolean;
  schedule: string;
  retentionDays: number;
  backupPath: string;
}

export interface BackupStatus {
  lastBackup: string | null;
  nextBackup: string | null;
  isRunning: boolean;
  error: string | null;
}

export interface BackupInfo {
  id: string;
  timestamp: string;
  size: number;
  path: string;
}

class BackupService {
  private static instance: BackupService;

  private constructor() {}

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  public async getConfig(): Promise<BackupConfig> {
    try {
      return await ipcRenderer.invoke('backup:get-config');
    } catch (error) {
      enqueueSnackbar('Failed to get backup configuration', { variant: 'error' });
      throw error;
    }
  }

  public async saveConfig(config: Partial<BackupConfig>): Promise<BackupConfig> {
    try {
      const result = await ipcRenderer.invoke('backup:set-config', config);
      enqueueSnackbar('Backup configuration saved', { variant: 'success' });
      return result;
    } catch (error) {
      enqueueSnackbar('Failed to save backup configuration', { variant: 'error' });
      throw error;
    }
  }

  public async startBackup(): Promise<void> {
    try {
      await ipcRenderer.invoke('backup:start');
      enqueueSnackbar('Backup started successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to start backup', { variant: 'error' });
      throw error;
    }
  }

  public async restoreBackup(backupId: string): Promise<void> {
    try {
      await ipcRenderer.invoke('backup:restore', backupId);
      enqueueSnackbar('Backup restored successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to restore backup', { variant: 'error' });
      throw error;
    }
  }

  public async deleteBackup(backupId: string): Promise<void> {
    try {
      await ipcRenderer.invoke('backup:delete', backupId);
      enqueueSnackbar('Backup deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete backup', { variant: 'error' });
      throw error;
    }
  }

  public async listBackups(): Promise<BackupInfo[]> {
    try {
      return await ipcRenderer.invoke('backup:list');
    } catch (error) {
      enqueueSnackbar('Failed to list backups', { variant: 'error' });
      throw error;
    }
  }

  public onBackupComplete(callback: (data: { timestamp: string }) => void): void {
    ipcRenderer.on('backup:complete', (_event, data) => callback(data));
  }

  public onBackupError(callback: (error: string) => void): void {
    ipcRenderer.on('backup:error', (_event, error) => callback(error));
  }

  public removeListeners(): void {
    ipcRenderer.removeAllListeners('backup:complete');
    ipcRenderer.removeAllListeners('backup:error');
  }
}

export const backupService = BackupService.getInstance(); 