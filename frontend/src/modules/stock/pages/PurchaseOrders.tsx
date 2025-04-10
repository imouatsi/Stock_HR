import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton as MuiIconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddItemIcon,
  Remove as RemoveItemIcon,
} from '@mui/icons-material';
import { useTranslation } from '../../../hooks/useTranslation';
import GradientButton from '../../../components/ui/GradientButton';
import { stockService, type PurchaseOrder, type Supplier, type InventoryItem } from '../../../services/stockService';
import { useAuth } from '../../../hooks/useAuth';
import { format } from 'date-fns';

const PurchaseOrders: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({
    supplier: '',
    items: [{ inventoryItem: '', quantity: 1, unitPrice: 0 }],
    notes: '',
    expectedDeliveryDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, suppliersData, itemsData] = await Promise.all([
        stockService.getAllPurchaseOrders(),
        stockService.getAllSuppliers(),
        stockService.getAllInventoryItems(),
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
      setInventoryItems(itemsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (order?: PurchaseOrder) => {
    if (order) {
      setSelectedOrder(order);
    } else {
      setSelectedOrder(null);
      setFormData({
        supplier: '',
        items: [{ inventoryItem: '', quantity: 1, unitPrice: 0 }],
        notes: '',
        expectedDeliveryDate: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { inventoryItem: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.supplier || formData.items.some(item => !item.inventoryItem || !item.quantity || !item.unitPrice)) {
        throw new Error('Please fill in all required fields');
      }

      await stockService.createPurchaseOrder(formData);
      await fetchData();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      setLoading(true);
      await stockService.updatePurchaseOrderStatus(orderId, status);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'ordered':
        return 'primary';
      case 'received':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateTotal = (items: { quantity: number; unitPrice: number }[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Purchase Orders
        </Typography>
        {user?.permissions.includes('stock:create') && (
          <GradientButton
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Purchase Order
          </GradientButton>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expected Delivery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order?.reference}</TableCell>
                <TableCell>
                  {suppliers?.find(supplier => supplier?._id === order?.supplier)?.name}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('fr-DZ', {
                    style: 'currency',
                    currency: 'DZD',
                  }).format(calculateTotal(order?.items || []))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order?.status === 'pending' ? 'Pending' :
                           order?.status === 'approved' ? 'Approved' :
                           order?.status === 'ordered' ? 'Ordered' :
                           order?.status === 'received' ? 'Received' :
                           order?.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                    color={getStatusColor(order?.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {order?.expectedDelivery ? format(new Date(order.expectedDelivery), 'dd/MM/yyyy') : ''}
                </TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(order)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedOrder ? 'Purchase Order Details' : 'Add Purchase Order'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedOrder ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Reference</Typography>
                  <Typography>{selectedOrder.reference}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Supplier</Typography>
                  <Typography>
                    {suppliers.find(supplier => supplier._id === selectedOrder.supplier)?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Typography>
                    {selectedOrder.status === 'pending' ? 'Pending' :
                     selectedOrder.status === 'approved' ? 'Approved' :
                     selectedOrder.status === 'ordered' ? 'Ordered' :
                     selectedOrder.status === 'received' ? 'Received' :
                     selectedOrder.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Expected Delivery</Typography>
                  <Typography>
                    {format(new Date(selectedOrder.expectedDeliveryDate), 'dd/MM/yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Items</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {inventoryItems.find(i => i._id === item.inventoryItem)?.name}
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              {new Intl.NumberFormat('fr-DZ', {
                                style: 'currency',
                                currency: 'DZD',
                              }).format(item.unitPrice)}
                            </TableCell>
                            <TableCell align="right">
                              {new Intl.NumberFormat('fr-DZ', {
                                style: 'currency',
                                currency: 'DZD',
                              }).format(item.quantity * item.unitPrice)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {selectedOrder.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Notes</Typography>
                    <Typography>{selectedOrder.notes}</Typography>
                  </Grid>
                )}
                {selectedOrder.status !== 'received' && selectedOrder.status !== 'cancelled' && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Update Status</InputLabel>
                      <Select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                        label="Update Status"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="ordered">Ordered</MenuItem>
                        <MenuItem value="received">Received</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Supplier</InputLabel>
                    <Select
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      label="Supplier"
                    >
                      {suppliers?.map((supplier) => (
                        <MenuItem key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Expected Delivery"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Items</Typography>
                    <Button
                      startIcon={<AddItemIcon />}
                      onClick={handleAddItem}
                    >
                      Add Item
                    </Button>
                  </Box>
                  {formData.items.map((item, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth required>
                          <InputLabel>Item</InputLabel>
                          <Select
                            value={item.inventoryItem}
                            onChange={(e) => handleItemChange(index, 'inventoryItem', e.target.value)}
                            label="Item"
                          >
                            {inventoryItems?.map((invItem) => (
                              <MenuItem key={invItem._id} value={invItem._id}>
                                {invItem.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          type="number"
                          label="Quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          type="number"
                          label="Unit Price"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                          <MuiIconButton
                            color="error"
                            onClick={() => handleRemoveItem(index)}
                            disabled={formData.items.length === 1}
                          >
                            <RemoveItemIcon />
                          </MuiIconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {selectedOrder ? 'Close' : 'Cancel'}
          </Button>
          {!selectedOrder && (
            <GradientButton onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </GradientButton>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrders;
