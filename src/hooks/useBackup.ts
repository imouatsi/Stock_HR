import { useState, useEffect, useCallback } from 'react';
import { backupService } from '../services/backupService';
import { BackupResult, BackupState } from '../types/backup';

export const useBackup = () => {
  const [state, setState] = useState<BackupState>({
    backups: [],
    isBackingUp: false,
    isRestoring: false,
  });

  const loadBackups = useCallback(async () => {
    try {
      const backups = await backupService.listBackups();
      setState(prev => ({
        ...prev,
        backups,
        lastBackup: backups[0],
        error: undefined,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load backups',
      }));
    }
  }, []);

  const createBackup = useCallback(async () => {
    setState(prev => ({ ...prev, isBackingUp: true, error: undefined }));
    try {
      const result = await backupService.createBackup();
      if (result.success) {
        await loadBackups();
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Backup failed',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Backup failed',
      }));
    } finally {
      setState(prev => ({ ...prev, isBackingUp: false }));
    }
  }, [loadBackups]);

  const restoreBackup = useCallback(async (backupPath: string) => {
    setState(prev => ({ ...prev, isRestoring: true, error: undefined }));
    try {
      const result = await backupService.restoreBackup(backupPath);
      if (!result.success) {
        setState(prev => ({
          ...prev,
          error: result.error || 'Restore failed',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Restore failed',
      }));
    } finally {
      setState(prev => ({ ...prev, isRestoring: false }));
    }
  }, []);

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  return {
    ...state,
    createBackup,
    restoreBackup,
    loadBackups,
  };
}; 