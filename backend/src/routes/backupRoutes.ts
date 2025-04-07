// backend/src/routes/backupRoutes.ts

import express from 'express';
import { backupController } from '../controllers/backupController';

const router = express.Router();

// Create a new backup
router.post('/create', backupController.createBackup);

// List all backups
router.get('/list', backupController.listBackups);

// Restore from a backup
router.post('/restore', backupController.restoreBackup);

// Delete a backup
router.delete('/delete', backupController.deleteBackup);

export default router; 