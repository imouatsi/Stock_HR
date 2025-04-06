import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Restore as RestoreIcon } from '@mui/icons-material';
import { useBackup } from '../hooks/useBackup';
import { BackupInfo } from '../services/backupService';

const BackupList: React.FC = () => {
  const { restoreBackup, deleteBackup } = useBackup();
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      setIsLoading(true);
      const result = await window.electron.ipcRenderer.invoke('backup:list');
      setBackups(result);
    } catch (error) {
      console.error('Failed to load backups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    try {
      await restoreBackup(backupId);
      await loadBackups();
    } catch (error) {
      console.error('Failed to restore backup:', error);
    }
  };

  const handleDelete = async (backupId: string) => {
    try {
      await deleteBackup(backupId);
      await loadBackups();
    } catch (error) {
      console.error('Failed to delete backup:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Backup History
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No backups found
                    </TableCell>
                  </TableRow>
                ) : (
                  backups.map(backup => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        {new Date(backup.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{formatFileSize(backup.size)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleRestore(backup.id)}
                          disabled={isLoading}
                          color="primary"
                        >
                          <RestoreIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(backup.id)}
                          disabled={isLoading}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BackupList; 