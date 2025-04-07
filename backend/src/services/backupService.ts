// backend/src/services/backupService.ts

import path from 'path';
import fs from 'fs-extra';
import { MongoClient } from 'mongodb';
import { config } from '../config';

interface BackupMetadata {
    id: string;
    timestamp: string;
    size: number;
    collections: string[];
}

interface BackupResult {
    id: string;
    timestamp: Date;
    backupPath: string;
    size: number;
    collections: string[];
}

class BackupService {
    private static instance: BackupService;
    private backupDir: string;
    private metadataPath: string;
    private client: MongoClient;
    private autoBackupInterval: NodeJS.Timeout | null = null;
    private initialized: boolean = false;

    private constructor() {
        this.backupDir = path.join(process.cwd(), 'backups');
        this.metadataPath = path.join(this.backupDir, 'backups.json');
        this.client = new MongoClient(config.mongoUri);
    }

    public static getInstance(): BackupService {
        if (!BackupService.instance) {
            BackupService.instance = new BackupService();
        }
        return BackupService.instance;
    }

    public async initialize(): Promise<void> {
        if (this.initialized) return;
        
        await fs.ensureDir(this.backupDir);
        if (!await fs.pathExists(this.metadataPath)) {
            await fs.writeJson(this.metadataPath, { backups: [] });
        }
        this.initialized = true;
        this.startAutoBackup();
    }

    private async getMetadata(): Promise<{ backups: BackupMetadata[] }> {
        if (!this.initialized) {
            await this.initialize();
        }
        return await fs.readJson(this.metadataPath);
    }

    private async saveMetadata(metadata: { backups: BackupMetadata[] }): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }
        await fs.writeJson(this.metadataPath, metadata, { spaces: 2 });
    }

    private startAutoBackup(): void {
        if (this.autoBackupInterval) {
            clearInterval(this.autoBackupInterval);
        }

        const now = new Date();
        const nextBackup = new Date(now);
        nextBackup.setHours(17, 0, 0, 0);
        
        if (now > nextBackup) {
            nextBackup.setDate(nextBackup.getDate() + 1);
        }

        const timeUntilNextBackup = nextBackup.getTime() - now.getTime();
        const nextBackupTime = nextBackup.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        console.log(`Next automatic backup scheduled for ${nextBackupTime}`);

        setTimeout(() => {
            this.performAutoBackup();
            this.autoBackupInterval = setInterval(() => {
                this.performAutoBackup();
            }, 24 * 60 * 60 * 1000);
        }, timeUntilNextBackup);
    }

    private async performAutoBackup(): Promise<void> {
        try {
            const currentTime = new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            console.log(`[${currentTime}] Starting automatic backup...`);
            await this.createBackup();
            console.log(`[${currentTime}] Automatic backup completed successfully`);
        } catch (error) {
            console.error('Automatic backup failed:', error);
        }
    }

    public async createBackup(): Promise<string> {
        const timestamp = new Date().toISOString();
        const id = `backup_${timestamp.replace(/[:.]/g, '-')}`;
        const backupPath = path.join(this.backupDir, `${id}.json`);

        try {
            await this.client.connect();
            const db = this.client.db();
            
            const collections = await db.listCollections().toArray();
            const backup: any = {};
            const collectionNames: string[] = [];
            
            for (const collection of collections) {
                const collectionName = collection.name;
                collectionNames.push(collectionName);
                const data = await db.collection(collectionName).find({}).toArray();
                backup[collectionName] = data;
            }

            await fs.writeJson(backupPath, backup, { spaces: 2 });
            const stats = await fs.stat(backupPath);

            // Update metadata
            const metadata = await this.getMetadata();
            metadata.backups.push({
                id,
                timestamp,
                size: stats.size,
                collections: collectionNames
            });
            await this.saveMetadata(metadata);

            await this.cleanupOldBackups();
            return id;
        } catch (error) {
            console.error('Backup failed:', error);
            throw error;
        } finally {
            await this.client.close();
        }
    }

    public async listBackups(): Promise<BackupResult[]> {
        try {
            const metadata = await this.getMetadata();
            const backups = metadata.backups.map(backup => ({
                id: backup.id,
                timestamp: new Date(backup.timestamp),
                backupPath: path.join(this.backupDir, `${backup.id}.json`),
                size: backup.size,
                collections: backup.collections
            }));

            return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        } catch (error) {
            console.error('Error listing backups:', error);
            throw error;
        }
    }

    public async restoreBackup(backupId: string): Promise<void> {
        try {
            const metadata = await this.getMetadata();
            const backupInfo = metadata.backups.find(b => b.id === backupId);
            
            if (!backupInfo) {
                throw new Error(`Backup not found: ${backupId}`);
            }

            const backupPath = path.join(this.backupDir, `${backupId}.json`);
            if (!await fs.pathExists(backupPath)) {
                throw new Error(`Backup file not found: ${backupId}`);
            }

            await this.client.connect();
            const db = this.client.db();
            
            const backup = await fs.readJson(backupPath);
            
            for (const [collectionName, data] of Object.entries(backup)) {
                try {
                    await db.collection(collectionName).drop();
                } catch (error) {
                    console.log(`Collection ${collectionName} does not exist, creating new one`);
                }
                
                if (Array.isArray(data) && data.length > 0) {
                    await db.collection(collectionName).insertMany(data as any[]);
                    console.log(`Restored ${data.length} documents to ${collectionName}`);
                }
            }
        } catch (error) {
            console.error('Restore failed:', error);
            throw error;
        } finally {
            await this.client.close();
        }
    }

    public async deleteBackup(backupId: string): Promise<void> {
        try {
            const metadata = await this.getMetadata();
            const backupIndex = metadata.backups.findIndex(b => b.id === backupId);
            
            if (backupIndex === -1) {
                throw new Error(`Backup not found: ${backupId}`);
            }

            const backupPath = path.join(this.backupDir, `${backupId}.json`);
            if (!await fs.pathExists(backupPath)) {
                throw new Error(`Backup file not found: ${backupId}`);
            }

            await fs.remove(backupPath);
            metadata.backups.splice(backupIndex, 1);
            await this.saveMetadata(metadata);
        } catch (error) {
            console.error('Delete failed:', error);
            throw error;
        }
    }

    private async cleanupOldBackups(): Promise<void> {
        const metadata = await this.getMetadata();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const backupsToDelete = metadata.backups.filter(backup => 
            new Date(backup.timestamp) < sevenDaysAgo
        );

        if (backupsToDelete.length > 0) {
            console.log(`Cleaning up ${backupsToDelete.length} old backups...`);
            await Promise.all(
                backupsToDelete.map(async backup => {
                    const backupPath = path.join(this.backupDir, `${backup.id}.json`);
                    await fs.remove(backupPath);
                })
            );
            
            metadata.backups = metadata.backups.filter(backup => 
                new Date(backup.timestamp) >= sevenDaysAgo
            );
            await this.saveMetadata(metadata);
            console.log('Cleanup completed');
        }
    }
}

export const backupService = BackupService.getInstance();