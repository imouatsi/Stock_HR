import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface LogEntry {
  timestamp: string;
  event: string;
  details: Record<string, unknown>;
  path: string;
  user: { id: string; name: string; email?: string; role?: string };
}

const AuthLogs: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    try {
      const authLogs = localStorage.getItem('auth_logs');
      if (authLogs) {
        setLogs(JSON.parse(authLogs));
      }
    } catch (error) {
      console.error('Failed to load authentication logs from localStorage:', error);
    }
  }, []);

  const clearLogs = () => {
    localStorage.removeItem('auth_logs');
    setLogs([]);
  };

  const getStatusColor = (event: string): 'success' | 'error' | 'info' | 'default' => {
    switch (event) {
      case 'API Response Success':
        return 'success';
      case 'API Response Error':
      case 'Unauthorized Access - Redirecting to Login':
        return 'error';
      case 'API Request':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Authentication Logs</Typography>
        <Button variant="outlined" color="error" onClick={clearLogs}>
          Clear Logs
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={log.event}
                    color={getStatusColor(log.event)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.path}</TableCell>
                <TableCell>
                  {log.user
                    ? `${log.user.email || 'Unknown Email'} (${log.user.role || 'Unknown Role'})`
                    : 'No user'}
                </TableCell>
                <TableCell>
                  <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuthLogs;