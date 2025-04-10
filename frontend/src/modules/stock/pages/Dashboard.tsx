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
}));

interface StockMovement {
  _id: string;
  type: string;
  quantity: number;
  product?: string;
  date?: string;
}

interface LowStockAlert {
  id: string;
  name: string;
  quantity: number;
  reorderPoint: number;
}

interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  pendingOrders: number;
  totalValue: number;
  recentMovements: StockMovement[];
  lowStockAlerts: LowStockAlert[];
}

const StockDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
      setError(null);

      // Fetch stock items
      const stockItems = await stockService.getAllStockItems();
      
      // Calculate total value
      const totalValue = stockItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      
      // Get low stock items
      const lowStockItems = stockItems.filter(item => item.quantity <= item.reorderPoint);
      
      // Fetch purchase orders
      const purchaseOrders = await stockService.getAllPurchaseOrders();
      const pendingOrders = purchaseOrders.filter(order => order.status === 'pending').length;
      
      // Fetch recent movements
      const movements = await stockService.getAllMovements({ limit: 5 });
      
      setStats({
        totalItems: stockItems.length,
        lowStockItems: lowStockItems.length,
        pendingOrders,
        totalValue,
        recentMovements: movements,
        lowStockAlerts: lowStockItems.map(item => ({
          id: item._id,
          name: item.name,
          quantity: item.quantity,
          reorderPoint: item.reorderPoint
        })).slice(0, 5),
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('stock.dashboard.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {t('stock.dashboard.totalItems')}
                </Typography>
                <Typography variant="h3" component="div">
                  {stats.totalItems}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 'auto' }}>
                  {t('stock.dashboard.itemsInInventory')}
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {t('stock.dashboard.lowStock')}
                </Typography>
                <Typography variant="h3" component="div" color="error">
                  {stats.lowStockItems}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 'auto' }}>
                  {t('stock.dashboard.itemsBelowThreshold')}
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {t('stock.dashboard.pendingOrders')}
                </Typography>
                <Typography variant="h3" component="div" color="primary">
                  {stats.pendingOrders}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 'auto' }}>
                  {t('stock.dashboard.awaitingDelivery')}
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {t('stock.dashboard.totalValue')}
                </Typography>
                <Typography variant="h3" component="div">
                  {new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(stats.totalValue)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 'auto' }}>
                  {t('stock.dashboard.inventoryWorth')}
                </Typography>
              </StyledPaper>
            </Grid>
          </Grid>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('stock.dashboard.recentMovements')}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('stock.movements.type')}</TableCell>
                    <TableCell>{t('stock.movements.product')}</TableCell>
                    <TableCell align="right">{t('stock.movements.quantity')}</TableCell>
                    <TableCell>{t('stock.movements.date')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentMovements && stats.recentMovements.length > 0 ? stats.recentMovements.map((movement) => (
                    <TableRow key={movement._id}>
                      <TableCell>
                        <Typography
                          color={
                            movement.type === 'in'
                              ? 'success.main'
                              : movement.type === 'out'
                              ? 'error.main'
                              : 'info.main'
                          }
                        >
                          {movement.type === 'in'
                            ? t('stock.movements.in')
                            : movement.type === 'out'
                            ? t('stock.movements.out')
                            : t('stock.movements.transfer')}
                        </Typography>
                      </TableCell>
                      <TableCell>{movement.product}</TableCell>
                      <TableCell align="right">{movement.quantity}</TableCell>
                      <TableCell>
                        {movement.date ? format(new Date(movement.date), 'dd/MM/yyyy HH:mm') : ''}
                      </TableCell>
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
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              {t('stock.dashboard.lowStockAlerts')}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('stock.items.name')}</TableCell>
                    <TableCell align="right">{t('stock.items.currentStock')}</TableCell>
                    <TableCell align="right">{t('stock.items.reorderPoint')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.lowStockAlerts && stats.lowStockAlerts.length > 0 ? stats.lowStockAlerts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">
                        <Typography color="error">{item.quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">{item.reorderPoint}</TableCell>
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
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StockDashboard;
