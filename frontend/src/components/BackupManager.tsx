import React, { useState } from 'react';
import { useBackup } from '../hooks/useBackup';
import { Button, Box, Typography, Alert, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Backup, Restore, Delete } from '@mui/icons-material';
import { dialog } from '@electron/remote';
import { readdirSync } from 'fs';
import { join } from 'path';

export const BackupManager: React.FC = () => {
  const { performBackup, restoreBackup, config, error, isLoading } = useBackup();
  const [backups, setBackups] = useState<string[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const refreshBackups = () => {
    try {
      const files = readdirSync(config.backupPath);
      const backupFiles = files.filter(file => 
        file.startsWith('backup-') && (file.endsWith('.sql') || file.endsWith('.7z'))
      );
      setBackups(backupFiles);
    } catch (err) {
      console.error('Failed to list backups:', err);
    }
  };

  React.useEffect(() => {
    refreshBackups();
  }, [config.backupPath]);

  const handleBackup = async () => {
    try {
      await performBackup();
      refreshBackups();
    } catch (err) {
      console.error('Backup failed:', err);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;

    try {
      await restoreBackup(join(config.backupPath, selectedBackup));
      setRestoreDialogOpen(false);
    } catch (err) {
      console.error('Restore failed:', err);
    }
  };

  const handleDelete = async (backupFile: string) => {
    try {
      const { unlinkSync } = require('fs');
      unlinkSync(join(config.backupPath, backupFile));
      refreshBackups();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Backup Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Backup />}
          onClick={handleBackup}
          disabled={isLoading}
        >
          {isLoading ? 'Backing up...' : 'Create Backup'}
        </Button>
      </Box>

      <List>
        {backups.map((backup) => (
          <ListItem
            key={backup}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  onClick={() => {
                    setSelectedBackup(backup);
                    setRestoreDialogOpen(true);
                  }}
                  disabled={isLoading}
                >
                  <Restore />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(backup)}
                  disabled={isLoading}
                >
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={backup}
              secondary={`Size: ${(require('fs').statSync(join(config.backupPath, backup)).size / 1024 / 1024).toFixed(2)} MB`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
        <DialogTitle>Confirm Restore</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to restore from backup "{selectedBackup}"? This will overwrite the current database.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRestore} color="primary" disabled={isLoading}>
            {isLoading ? 'Restoring...' : 'Restore'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 