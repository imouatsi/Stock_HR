import { ipcMain } from 'electron';
import backupService from '../services/backupService';

export const setupBackupHandlers = () => {
  ipcMain.handle('perform-backup', async () => {
    return await backupService.performBackup();
  });

  ipcMain.handle('restore-backup', async (_, backupPath: string) => {
    return await backupService.restoreBackup(backupPath);
  });

  ipcMain.handle('get-backup-config', () => {
    return backupService.getConfig();
  });

  ipcMain.handle('update-backup-config', (_, newConfig: Partial<BackupConfig>) => {
    backupService.updateConfig(newConfig);
    return backupService.getConfig();
  });
}; 