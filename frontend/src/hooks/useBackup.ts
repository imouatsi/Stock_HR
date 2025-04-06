import { useState, useCallback, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { ipcRenderer } from 'electron';
import { BackupConfig, BackupStatus, BackupInfo } from '../services/backupService';

export const useBackup = () => {
  const [config, setConfig] = useState<BackupConfig>({
    enabled: false,
    schedule: '0 0 * * *', // Default: daily at midnight
    retentionDays: 7,
    backupPath: '',
  });

  const [status, setStatus] = useState<BackupStatus>({
    lastBackup: null,
    nextBackup: null,
    isRunning: false,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      const savedConfig = await ipcRenderer.invoke('backup:get-config');
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (error) {
      enqueueSnackbar('Failed to load backup configuration', { variant: 'error' });
    }
  }, []);

  const saveConfig = useCallback(async (newConfig: Partial<BackupConfig>) => {
    try {
      setIsLoading(true);
      const updatedConfig = { ...config, ...newConfig };
      await ipcRenderer.invoke('backup:set-config', updatedConfig);
      setConfig(updatedConfig);
      enqueueSnackbar('Backup configuration saved', { variant: 'success' });
    } catch (error) {
      setError('Failed to save backup configuration');
      enqueueSnackbar('Failed to save backup configuration', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const startBackup = useCallback(async () => {
    try {
      setIsLoading(true);
      setStatus(prev => ({ ...prev, isRunning: true, error: null }));
      await ipcRenderer.invoke('backup:start');
      enqueueSnackbar('Backup started successfully', { variant: 'success' });
    } catch (error) {
      setError('Failed to start backup');
      setStatus(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Unknown error' }));
      enqueueSnackbar('Failed to start backup', { variant: 'error' });
    } finally {
      setIsLoading(false);
      setStatus(prev => ({ ...prev, isRunning: false }));
    }
  }, []);

  const restoreBackup = useCallback(async (backupId: string) => {
    try {
      setIsLoading(true);
      setStatus(prev => ({ ...prev, isRunning: true, error: null }));
      await ipcRenderer.invoke('backup:restore', backupId);
      enqueueSnackbar('Backup restored successfully', { variant: 'success' });
    } catch (error) {
      setError('Failed to restore backup');
      setStatus(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Unknown error' }));
      enqueueSnackbar('Failed to restore backup', { variant: 'error' });
    } finally {
      setIsLoading(false);
      setStatus(prev => ({ ...prev, isRunning: false }));
    }
  }, []);

  const deleteBackup = useCallback(async (backupId: string) => {
    try {
      setIsLoading(true);
      await ipcRenderer.invoke('backup:delete', backupId);
      enqueueSnackbar('Backup deleted successfully', { variant: 'success' });
    } catch (error) {
      setError('Failed to delete backup');
      enqueueSnackbar('Failed to delete backup', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();

    const handleBackupComplete = (_event: Electron.IpcRendererEvent, data: { timestamp: string }) => {
      setStatus(prev => ({
        ...prev,
        lastBackup: data.timestamp,
        nextBackup: calculateNextBackupTime(config.schedule),
      }));
    };

    const handleBackupError = (_event: Electron.IpcRendererEvent, error: string) => {
      setStatus(prev => ({ ...prev, error }));
    };

    ipcRenderer.on('backup:complete', handleBackupComplete);
    ipcRenderer.on('backup:error', handleBackupError);

    return () => {
      ipcRenderer.removeListener('backup:complete', handleBackupComplete);
      ipcRenderer.removeListener('backup:error', handleBackupError);
    };
  }, [config.schedule, loadConfig]);

  return {
    config,
    status,
    isLoading,
    error,
    saveConfig,
    startBackup,
    restoreBackup,
    deleteBackup,
  };
};

function calculateNextBackupTime(schedule: string): string {
  // This is a placeholder implementation
  // In a real application, you would use a cron parser library
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
} 