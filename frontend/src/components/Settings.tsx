import React, { useState } from 'react';
import { useBackup } from '../hooks/useBackup';
import { useAuth } from '../hooks/useAuth';
import { Box, Typography, TextField, Switch, FormControlLabel, Button, Alert, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { FolderOpen, Backup, Restore, Delete } from '@mui/icons-material';
import { dialog } from '@electron/remote';
import { readdirSync } from 'fs';
import { join } from 'path';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { config, updateConfig, performBackup, restoreBackup, error, isLoading } = useBackup();
  const [localConfig, setLocalConfig] = useState(config);
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

  const handlePathChange = async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: localConfig.backupPath
    });

    if (!result.canceled && result.filePaths[0]) {
      setLocalConfig(prev => ({ ...prev, backupPath: result.filePaths[0] }));
    }
  };

  const handleSave = async () => {
    await updateConfig(localConfig);
  };

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

  if (!user || (user.role !== 'SuperAdmin' && user.role !== 'Admin')) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">You don't have permission to access this page.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Backup Configuration
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          label="Backup Path"
          value={localConfig.backupPath}
          onChange={(e) => setLocalConfig(prev => ({ ...prev, backupPath: e.target.value }))}
          disabled={isLoading}
        />
        <Button
          startIcon={<FolderOpen />}
          onClick={handlePathChange}
          sx={{ ml: 1 }}
          disabled={isLoading}
        >
          Browse
        </Button>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={localConfig.enableEncryption}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, enableEncryption: e.target.checked }))}
            disabled={isLoading}
          />
        }
        label="Enable Encryption"
      />

      {localConfig.enableEncryption && (
        <TextField
          fullWidth
          type="password"
          label="Encryption Password"
          value={localConfig.encryptionPassword || ''}
          onChange={(e) => setLocalConfig(prev => ({ ...prev, encryptionPassword: e.target.value }))}
          disabled={isLoading}
          sx={{ mt: 2 }}
        />
      )}

      <TextField
        fullWidth
        type="number"
        label="Retention Days"
        value={localConfig.retentionDays}
        onChange={(e) => setLocalConfig(prev => ({ ...prev, retentionDays: parseInt(e.target.value) || 7 }))}
        disabled={isLoading}
        sx={{ mt: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Saving...' : 'Save Configuration'}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Backup Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<Backup />}
        onClick={handleBackup}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? 'Backing up...' : 'Create Backup'}
      </Button>

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