import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { stockService } from '../../../services/stockService';
import { format } from 'date-fns';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: 240,
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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        inventoryItems,
        purchaseOrders,
        movements
      ] = await Promise.all([
        stockService.getAllInventoryItems(),
        stockService.getAllPurchaseOrders(),
        stockService.getAllMovements({ limit: 5 })
      ]);

      const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minStockLevel);
      const pendingOrders = purchaseOrders.filter(order => order.status === 'pending');
      const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

      setStats({
        totalItems: inventoryItems.length,
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
        {t('stock.dashboard.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Stock Overview */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              {t('stock.dashboard.totalItems')}
            </Typography>
            <Typography variant="h3" component="div">
              {stats.totalItems}
            </Typography>
            <Typography color="text.secondary">
              {t('stock.dashboard.acrossCategories')}
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Low Stock Items */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              {t('stock.dashboard.lowStockItems')}
            </Typography>
            <Typography variant="h3" component="div" color="error">
              {stats.lowStockItems}
            </Typography>
            <Typography color="text.secondary">
              {t('stock.dashboard.belowThreshold')}
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Pending Orders */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              {t('stock.dashboard.pendingOrders')}
            </Typography>
            <Typography variant="h3" component="div" color="warning.main">
              {stats.pendingOrders}
            </Typography>
            <Typography color="text.secondary">
              {t('stock.dashboard.awaitingDelivery')}
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Total Value */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              {t('stock.dashboard.totalValue')}
            </Typography>
            <Typography variant="h3" component="div" color="success.main">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(stats.totalValue)}
            </Typography>
            <Typography color="text.secondary">
              {t('stock.dashboard.currentValue')}
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Recent Stock Movements */}
        <Grid item xs={12} md={6}>
          <StyledPaper sx={{ height: 'auto', minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              {t('stock.dashboard.recentMovements')}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('stock.movements.date')}</TableCell>
                    <TableCell>{t('stock.movements.type')}</TableCell>
                    <TableCell>{t('stock.movements.quantity')}</TableCell>
                    <TableCell>{t('stock.movements.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentMovements.map((movement) => (
                    <TableRow key={movement._id}>
                      <TableCell>{format(new Date(movement.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell>{movement.type}</TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} md={6}>
          <StyledPaper sx={{ height: 'auto', minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              {t('stock.dashboard.lowStockAlerts')}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('stock.items.name')}</TableCell>
                    <TableCell>{t('stock.items.quantity')}</TableCell>
                    <TableCell>{t('stock.items.minLevel')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.lowStockAlerts.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.minStockLevel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockDashboard; 