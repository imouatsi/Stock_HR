//backend/src/controllers/backupController.ts
// 
import { Request, Response } from 'express';
import { backupService } from '../services/backupService';
import path from 'path';

export const backupController = {
    // Create a new backup
    createBackup: async (req: Request, res: Response) => {
        try {
            const backupPath = await backupService.createBackup();
            res.json({ success: true, backupPath });
        } catch (error) {
            console.error('Backup creation failed:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to create backup' 
            });
        }
    },

    // List all backups
    listBackups: async (req: Request, res: Response) => {
        try {
            const backups = await backupService.listBackups();
            res.json({ success: true, backups });
        } catch (error) {
            console.error('Failed to list backups:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to list backups' 
            });
        }
    },

    // Restore from a backup
    restoreBackup: async (req: Request, res: Response) => {
        try {
            const { backupId } = req.body;
            if (!backupId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Backup ID is required' 
                });
            }

            await backupService.restoreBackup(backupId);
            res.json({ success: true });
        } catch (error) {
            console.error('Backup restoration failed:', error);
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to restore backup' 
            });
        }
    },

    // Delete a backup
    deleteBackup: async (req: Request, res: Response) => {
        try {
            const { backupId } = req.body;
            if (!backupId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Backup ID is required' 
                });
            }

            await backupService.deleteBackup(backupId);
            res.json({ success: true });
        } catch (error) {
            console.error('Backup deletion failed:', error);
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to delete backup' 
            });
        }
    }
}; 