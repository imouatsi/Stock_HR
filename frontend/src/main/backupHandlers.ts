import { ipcMain } from 'electron';
import backupService from '../services/backupService';

export const setupBackupHandlers = () => {
  ipcMain.handle('backup:list', async () => {
    return await backupService.listBackups();
  });

  ipcMain.handle('backup:create', async () => {
    return await backupService.createBackup();
  });

  ipcMain.handle('backup:restore', async (_, backupId: string) => {
    return await backupService.restoreBackup(backupId);
  });

  ipcMain.handle('backup:delete', async (_, backupId: string) => {
    return await backupService.deleteBackup(backupId);
  });

  ipcMain.handle('backup:get-config', () => {
    return backupService.getConfig();
  });

  ipcMain.handle('backup:set-config', (_, newConfig: Partial<BackupConfig>) => {
    backupService.updateConfig(newConfig);
    return backupService.getConfig();
  });
}; 