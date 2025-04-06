import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useBackup } from '../hooks/useBackup';
import { BackupConfig } from '../services/backupService';

const BackupSettings: React.FC = () => {
  const { config, status, isLoading, error, saveConfig, startBackup } = useBackup();
  const [localConfig, setLocalConfig] = useState<BackupConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleConfigChange = (field: keyof BackupConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await saveConfig(localConfig);
  };

  const handleStartBackup = async () => {
    await startBackup();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Backup Settings
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.enabled}
                    onChange={e => handleConfigChange('enabled', e.target.checked)}
                  />
                }
                label="Enable Automatic Backups"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Backup Schedule</InputLabel>
                <Select
                  value={localConfig.schedule}
                  onChange={e => handleConfigChange('schedule', e.target.value)}
                  label="Backup Schedule"
                >
                  <MenuItem value="0 0 * * *">Daily at Midnight</MenuItem>
                  <MenuItem value="0 */6 * * *">Every 6 Hours</MenuItem>
                  <MenuItem value="0 */12 * * *">Every 12 Hours</MenuItem>
                  <MenuItem value="0 0 * * 0">Weekly on Sunday</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Retention Days"
                value={localConfig.retentionDays}
                onChange={e => handleConfigChange('retentionDays', parseInt(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Backup Path"
                value={localConfig.backupPath}
                onChange={e => handleConfigChange('backupPath', e.target.value)}
                helperText="Leave empty to use default path"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  Save Settings
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleStartBackup}
                  disabled={isLoading || status.isRunning}
                >
                  Start Backup Now
                </Button>
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            {status.lastBackup && (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Last backup: {new Date(status.lastBackup).toLocaleString()}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BackupSettings; 