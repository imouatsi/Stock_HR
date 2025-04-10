import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, useTheme as useMuiTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { stockService } from '../../../services/stockService';
import { format } from 'date-fns';
import { useTheme } from '@/components/theme-provider';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: 240,
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
  border: theme.palette.mode === 'dark' ? '1px solid #333' : 'none',
}));

interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  pendingOrders: number;
  totalValue: number;
  recentMovements: any[];
  lowStockAlerts: any[];
}

const StockDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { theme: appTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    totalValue: 0,
    recentMovements: [],
    lowStockAlerts: [],
  });

  useEffect(() => {
    // Set a mock token for testing
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmQ3YzRkMzRkMzRkMzRkMzRkMzRkMyIsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNjE1MjM5MDIyLCJleHAiOjE2MTUzMjU0MjJ9.7dKxerLxEYh_zH8uQmKjZOlXxjRBPR50TRfZp9TTOlQ');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get stock items first
      const stockItems = await stockService.getAllStockItems();

      // Try to get purchase orders and movements, but handle errors
      let purchaseOrders = [];
      let movements = [];

      try {
        purchaseOrders = await stockService.getAllPurchaseOrders();
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
      }

      try {
        movements = await stockService.getAllMovements({ limit: 5 });
      } catch (error) {
        console.error('Error fetching movements:', error);
      }

      const lowStockItems = stockItems.filter(item => item.quantity <= item.reorderPoint);
      const pendingOrders = purchaseOrders.filter(order => order.status === 'pending');
      const totalValue = stockItems.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice);
      }, 0);

      setStats({
        totalItems: stockItems.length,
        lowStockItems: lowStockItems.length,
        pendingOrders: pendingOrders.length,
        totalValue,
        recentMovements: movements,
        lowStockAlerts: lowStockItems,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
        {/* Stock Overview */}
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' } }}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Total Items
            </Typography>
            <Typography variant="h3" component="div">
              {stats.totalItems}
            </Typography>
            <Typography color="text.secondary">
              Across all categories
            </Typography>
          </StyledPaper>
        </Box>

        {/* Low Stock Items */}
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' } }}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Low Stock Items
            </Typography>
            <Typography variant="h3" component="div" color="error">
              {stats.lowStockItems}
            </Typography>
            <Typography color="text.secondary">
              Items below threshold
            </Typography>
          </StyledPaper>
        </Box>

        {/* Pending Orders */}
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' } }}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Pending Orders
            </Typography>
            <Typography variant="h3" component="div" color="warning.main">
              {stats.pendingOrders}
            </Typography>
            <Typography color="text.secondary">
              Awaiting delivery
            </Typography>
          </StyledPaper>
        </Box>

        {/* Total Value */}
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' } }}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Total Value
            </Typography>
            <Typography variant="h3" component="div" color="success.main">
              {new Intl.NumberFormat('fr-DZ', {
                style: 'currency',
                currency: 'DZD',
              }).format(stats.totalValue)}
            </Typography>
            <Typography color="text.secondary">
              Current inventory value
            </Typography>
          </StyledPaper>
        </Box>

        {/* Recent Stock Movements */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <StyledPaper sx={{ height: 'auto', minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              Recent Stock Movements
            </Typography>
            <TableContainer>
              <Table size="small" sx={{
                '& .MuiTableCell-root': {
                  color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit'
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>Date</TableCell>
                    <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>Type</TableCell>
                    <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>Quantity</TableCell>
                    <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentMovements && stats.recentMovements.length > 0 ? stats.recentMovements.map((movement) => (
                    <TableRow key={movement._id}>
                      <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>{movement.date ? format(new Date(movement.date), 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
                      <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>{movement.type}</TableCell>
                      <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>{movement.quantity}</TableCell>
                      <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>{movement.status}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>
                        No recent movements found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Box>

        {/* Low Stock Alerts */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <StyledPaper sx={{ height: 'auto', minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alerts
            </Typography>
            <TableContainer>
              <Table size="small" sx={{
                '& .MuiTableCell-root': {
                  color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit'
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>Name</TableCell>
                    <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>Quantity</TableCell>
                    <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>Min Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.lowStockAlerts && stats.lowStockAlerts.length > 0 ? stats.lowStockAlerts.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>{item?.name}</TableCell>
                      <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>{item?.quantity || 0}</TableCell>
                      <TableCell sx={{ color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>{item?.reorderPoint || 0}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', color: muiTheme.palette.mode === 'dark' ? muiTheme.palette.text.primary : 'inherit' }}>
                        No low stock alerts
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Box>
      </Box>
    </Box>
  );
};

export default StockDashboard;