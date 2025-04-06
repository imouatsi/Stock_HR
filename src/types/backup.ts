export interface BackupConfig {
  backupDir: string;
  compressionLevel: number;
  encryptionKey: string;
  maxBackups: number;
  backupInterval: number;
}

export interface BackupResult {
  success: boolean;
  backupPath?: string;
  timestamp: Date;
  size?: number;
  error?: string;
}

export interface BackupState {
  backups: BackupResult[];
  isBackingUp: boolean;
  isRestoring: boolean;
  lastBackup?: BackupResult;
  error?: string;
} 