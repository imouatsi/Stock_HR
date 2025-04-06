import React, { useState } from 'react';
import { useBackup } from '../hooks/useBackup';
import { Button, TextField, Switch, FormControlLabel, Box, Typography, Alert } from '@mui/material';
import { FolderOpen } from '@mui/icons-material';
import { dialog } from '@electron/remote';

export const BackupConfigPanel: React.FC = () => {
  const { config, updateConfig, error, isLoading } = useBackup();
  const [localConfig, setLocalConfig] = useState(config);

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

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Backup Configuration
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
        sx={{ mt: 3 }}
      >
        {isLoading ? 'Saving...' : 'Save Configuration'}
      </Button>
    </Box>
  );
}; 