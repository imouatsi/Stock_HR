import { app, ipcMain } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

interface BackupConfig {
  enabled: boolean;
  schedule: string;
  retentionDays: number;
  backupPath: string;
}

interface BackupInfo {
  id: string;
  timestamp: string;
  size: number;
  path: string;
}

class BackupHandler {
  private static instance: BackupHandler;
  private config: BackupConfig;
  private backupPath: string;

  private constructor() {
    this.backupPath = join(app.getPath('userData'), 'backups');
    this.config = {
      enabled: false,
      schedule: '0 0 * * *', // Default: daily at midnight
      retentionDays: 7,
      backupPath: this.backupPath,
    };
    this.initializeBackupDirectory();
    this.setupIpcHandlers();
  }

  public static getInstance(): BackupHandler {
    if (!BackupHandler.instance) {
      BackupHandler.instance = new BackupHandler();
    }
    return BackupHandler.instance;
  }

  private initializeBackupDirectory(): void {
    if (!existsSync(this.backupPath)) {
      mkdirSync(this.backupPath, { recursive: true });
    }
  }

  private setupIpcHandlers(): void {
    ipcMain.handle('backup:get-config', () => this.config);
    ipcMain.handle('backup:set-config', (_event, config: Partial<BackupConfig>) => {
      this.config = { ...this.config, ...config };
      return this.config;
    });

    ipcMain.handle('backup:start', async () => {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = join(this.backupPath, `backup-${timestamp}.sql`);
        const compressedFile = `${backupFile}.7z`;

        // Create PostgreSQL dump
        await execAsync(`pg_dump -U postgres -d stock_hr > "${backupFile}"`);

        // Compress the backup
        await execAsync(`7z a "${compressedFile}" "${backupFile}"`);

        // Remove the uncompressed file
        await execAsync(`rm "${backupFile}"`);

        // Clean up old backups
        await this.cleanupOldBackups();

        return { success: true, timestamp };
      } catch (error) {
        throw new Error(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    ipcMain.handle('backup:restore', async (_event, backupId: string) => {
      try {
        const backupFile = join(this.backupPath, backupId);
        const tempFile = join(this.backupPath, 'temp.sql');

        // Extract the backup
        await execAsync(`7z x "${backupFile}" -o"${this.backupPath}"`);

        // Restore the database
        await execAsync(`psql -U postgres -d stock_hr < "${tempFile}"`);

        // Clean up
        await execAsync(`rm "${tempFile}"`);

        return { success: true };
      } catch (error) {
        throw new Error(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    ipcMain.handle('backup:delete', async (_event, backupId: string) => {
      try {
        const backupFile = join(this.backupPath, backupId);
        if (existsSync(backupFile)) {
          unlinkSync(backupFile);
          return { success: true };
        }
        throw new Error('Backup file not found');
      } catch (error) {
        throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    ipcMain.handle('backup:list', () => {
      try {
        const files = readdirSync(this.backupPath);
        return files
          .filter(file => file.endsWith('.7z'))
          .map(file => {
            const stats = require('fs').statSync(join(this.backupPath, file));
            return {
              id: file,
              timestamp: file.replace('backup-', '').replace('.sql.7z', ''),
              size: stats.size,
              path: join(this.backupPath, file),
            };
          });
      } catch (error) {
        throw new Error(`List backups failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = readdirSync(this.backupPath);
      const now = new Date();
      const retentionDate = new Date(now.getTime() - this.config.retentionDays * 24 * 60 * 60 * 1000);

      for (const file of files) {
        if (file.endsWith('.7z')) {
          const timestamp = file.replace('backup-', '').replace('.sql.7z', '');
          const backupDate = new Date(timestamp);
          if (backupDate < retentionDate) {
            unlinkSync(join(this.backupPath, file));
          }
        }
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

export const backupHandler = BackupHandler.getInstance(); 