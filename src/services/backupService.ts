import { app } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';
import { BackupConfig, BackupResult } from '../types/backup';

const execAsync = promisify(exec);

class BackupService {
  private static instance: BackupService;
  private backupConfig: BackupConfig;

  private constructor() {
    this.backupConfig = {
      backupDir: path.join(app.getPath('userData'), 'backups'),
      compressionLevel: 9,
      encryptionKey: process.env.BACKUP_ENCRYPTION_KEY || '',
      maxBackups: 5,
      backupInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    };
  }

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  public async initialize(): Promise<void> {
    await fs.ensureDir(this.backupConfig.backupDir);
  }

  public async createBackup(): Promise<BackupResult> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup_${timestamp}.sql`;
      const backupPath = path.join(this.backupConfig.backupDir, backupFileName);
      const compressedPath = `${backupPath}.gz`;

      // Create backup using pg_dump
      const pgDumpCommand = `pg_dump -U postgres -d stock_hr > "${backupPath}"`;
      await execAsync(pgDumpCommand);

      // Compress the backup
      const gzipCommand = `gzip -${this.backupConfig.compressionLevel} "${backupPath}"`;
      await execAsync(gzipCommand);

      // Encrypt if encryption key is provided
      if (this.backupConfig.encryptionKey) {
        await this.encryptBackup(compressedPath);
      }

      // Clean up old backups
      await this.cleanupOldBackups();

      return {
        success: true,
        backupPath: compressedPath,
        timestamp: new Date(),
        size: await this.getFileSize(compressedPath),
      };
    } catch (error) {
      console.error('Backup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date(),
      };
    }
  }

  private async encryptBackup(filePath: string): Promise<void> {
    const input = await fs.readFile(filePath);
    const cipher = crypto.createCipher('aes-256-gcm', this.backupConfig.encryptionKey);
    const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
    await fs.writeFile(filePath, encrypted);
  }

  private async cleanupOldBackups(): Promise<void> {
    const files = await fs.readdir(this.backupConfig.backupDir);
    const backupFiles = files
      .filter(file => file.startsWith('backup_') && file.endsWith('.sql.gz'))
      .sort()
      .reverse();

    if (backupFiles.length > this.backupConfig.maxBackups) {
      const filesToDelete = backupFiles.slice(this.backupConfig.maxBackups);
      await Promise.all(
        filesToDelete.map(file =>
          fs.remove(path.join(this.backupConfig.backupDir, file))
        )
      );
    }
  }

  private async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  public async listBackups(): Promise<BackupResult[]> {
    try {
      const files = await fs.readdir(this.backupConfig.backupDir);
      const backupFiles = files.filter(file => file.startsWith('backup_') && file.endsWith('.sql.gz'));

      const backups = await Promise.all(
        backupFiles.map(async file => {
          const filePath = path.join(this.backupConfig.backupDir, file);
          const stats = await fs.stat(filePath);
          return {
            success: true,
            backupPath: filePath,
            timestamp: stats.mtime,
            size: stats.size,
          };
        })
      );

      return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  public async restoreBackup(backupPath: string): Promise<BackupResult> {
    try {
      // Decrypt if encrypted
      if (this.backupConfig.encryptionKey) {
        await this.decryptBackup(backupPath);
      }

      // Decompress the backup
      const decompressedPath = backupPath.replace('.gz', '');
      await execAsync(`gzip -d "${backupPath}"`);

      // Restore the database
      const restoreCommand = `psql -U postgres -d stock_hr < "${decompressedPath}"`;
      await execAsync(restoreCommand);

      // Clean up decompressed file
      await fs.remove(decompressedPath);

      return {
        success: true,
        backupPath,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Restore failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date(),
      };
    }
  }

  private async decryptBackup(filePath: string): Promise<void> {
    const input = await fs.readFile(filePath);
    const decipher = crypto.createDecipher('aes-256-gcm', this.backupConfig.encryptionKey);
    const decrypted = Buffer.concat([decipher.update(input), decipher.final()]);
    await fs.writeFile(filePath, decrypted);
  }
}

export const backupService = BackupService.getInstance(); 