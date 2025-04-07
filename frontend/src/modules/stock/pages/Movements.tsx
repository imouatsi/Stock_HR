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
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTranslation } from '../../../hooks/useTranslation';
import GradientButton from '../../../components/ui/GradientButton';
import { stockService, type StockMovement, type InventoryItem } from '../../../services/stockService';
import { useAuth } from '../../../hooks/useAuth';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';

interface MovementFilters {
  type: string;
  status: string;
  inventoryItem: string;
  startDate: string;
  endDate: string;
}

interface MovementFormData {
  inventoryItem: string;
  quantity: number;
  type: 'in' | 'out' | 'transfer';
  source?: string;
  destination?: string;
  notes?: string;
}

const Movements: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [filters, setFilters] = useState<MovementFilters>({
    type: '',
    status: '',
    inventoryItem: '',
    startDate: '',
    endDate: '',
  });
  const [formData, setFormData] = useState<MovementFormData>({
    inventoryItem: '',
    quantity: 0,
    type: 'in',
    source: '',
    destination: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'cancel' | null>(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [movementsData, itemsData] = await Promise.all([
        stockService.getAllMovements(filters),
        stockService.getAllInventoryItems(),
      ]);
      setMovements(movementsData);
      setInventoryItems(itemsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      enqueueSnackbar('Error loading data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof MovementFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenDialog = (movement?: StockMovement) => {
    if (movement) {
      setSelectedMovement(movement);
      setFormData({
        inventoryItem: movement.inventoryItem,
        quantity: movement.quantity,
        type: movement.type,
        source: movement.source || '',
        destination: movement.destination || '',
        notes: movement.notes || '',
      });
    } else {
      setSelectedMovement(null);
      setFormData({
        inventoryItem: '',
        quantity: 0,
        type: 'in',
        source: '',
        destination: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMovement(null);
    setFormData({
      inventoryItem: '',
      quantity: 0,
      type: 'in',
      source: '',
      destination: '',
      notes: '',
    });
    setFormErrors({});
  };

  const validateForm = (data: MovementFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.inventoryItem) {
      errors.inventoryItem = 'Inventory item is required';
    }

    if (!data.quantity || data.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    if (data.type === 'transfer') {
      if (!data.source) {
        errors.source = 'Source location is required for transfers';
      }
      if (!data.destination) {
        errors.destination = 'Destination location is required for transfers';
      }
      if (data.source === data.destination) {
        errors.destination = 'Source and destination cannot be the same';
      }
    }

    return errors;
  };

  const handleFormChange = (field: keyof MovementFormData, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    const errors = validateForm(newFormData);
    setFormErrors(errors);
  };

  const handleSubmit = async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (selectedMovement) {
        await stockService.updateMovement(selectedMovement._id, formData);
        enqueueSnackbar('Movement updated successfully', { variant: 'success' });
      } else {
        await stockService.createMovement(formData);
        enqueueSnackbar('Movement created successfully', { variant: 'success' });
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save movement');
      enqueueSnackbar('Error saving movement', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedMovement || !actionType) return;

    try {
      setLoading(true);
      if (actionType === 'delete') {
        await stockService.deleteMovement(selectedMovement._id);
        enqueueSnackbar('Movement deleted successfully', { variant: 'success' });
      } else if (actionType === 'cancel') {
        await stockService.cancelMovement(selectedMovement._id);
        enqueueSnackbar('Movement cancelled successfully', { variant: 'success' });
      }
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${actionType} movement`);
      enqueueSnackbar(`Error ${actionType}ing movement`, { variant: 'error' });
    } finally {
      setLoading(false);
      setConfirmDialog(false);
      setSelectedMovement(null);
      setActionType(null);
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'success';
      case 'out':
        return 'error';
      case 'transfer':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && movements.length === 0) {
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
          {t('stock.movements.title')}
        </Typography>
        {user?.permissions.includes('stock:create') && (
          <GradientButton
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('stock.movements.add')}
          </GradientButton>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('stock.movements.type')}</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                label={t('stock.movements.type')}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value="in">{t('stock.movements.in')}</MenuItem>
                <MenuItem value="out">{t('stock.movements.out')}</MenuItem>
                <MenuItem value="transfer">{t('stock.movements.transfer')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('stock.movements.status')}</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label={t('stock.movements.status')}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value="pending">{t('stock.movements.pending')}</MenuItem>
                <MenuItem value="completed">{t('stock.movements.completed')}</MenuItem>
                <MenuItem value="cancelled">{t('stock.movements.cancelled')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('stock.movements.inventoryItem')}</InputLabel>
              <Select
                value={filters.inventoryItem}
                onChange={(e) => handleFilterChange('inventoryItem', e.target.value)}
                label={t('stock.movements.inventoryItem')}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                {inventoryItems.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label={t('stock.movements.startDate')}
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label={t('stock.movements.endDate')}
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('stock.movements.reference')}</TableCell>
              <TableCell>{t('stock.movements.type')}</TableCell>
              <TableCell>{t('stock.movements.quantity')}</TableCell>
              <TableCell>{t('stock.movements.inventoryItem')}</TableCell>
              <TableCell>{t('stock.movements.status')}</TableCell>
              <TableCell>{t('stock.movements.timestamp')}</TableCell>
              <TableCell>{t('stock.movements.user')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow key={movement._id}>
                  <TableCell>{movement.reference}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`stock.movements.${movement.type}`)}
                      color={getMovementTypeColor(movement.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>
                    {inventoryItems.find(item => item._id === movement.inventoryItem)?.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`stock.movements.${movement.status}`)}
                      color={getStatusColor(movement.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{format(new Date(movement.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{movement.user.name}</TableCell>
                  <TableCell>
                    <Tooltip title={t('common.edit')}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(movement)}
                        disabled={movement.status === 'completed'}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('stock.movements.cancel')}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedMovement(movement);
                          setActionType('cancel');
                          setConfirmDialog(true);
                        }}
                        disabled={movement.status !== 'pending'}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedMovement(movement);
                          setActionType('delete');
                          setConfirmDialog(true);
                        }}
                        disabled={movement.status === 'completed'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Movement Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMovement ? t('stock.movements.edit') : t('stock.movements.add')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.inventoryItem}>
                <InputLabel>{t('stock.movements.inventoryItem')}</InputLabel>
                <Select
                  value={formData.inventoryItem}
                  onChange={(e) => handleFormChange('inventoryItem', e.target.value)}
                  label={t('stock.movements.inventoryItem')}
                  disabled={!!selectedMovement}
                >
                  {inventoryItems.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.inventoryItem && (
                  <Typography color="error" variant="caption">
                    {formErrors.inventoryItem}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.type}>
                <InputLabel>{t('stock.movements.type')}</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  label={t('stock.movements.type')}
                  disabled={!!selectedMovement}
                >
                  <MenuItem value="in">{t('stock.movements.in')}</MenuItem>
                  <MenuItem value="out">{t('stock.movements.out')}</MenuItem>
                  <MenuItem value="transfer">{t('stock.movements.transfer')}</MenuItem>
                </Select>
                {formErrors.type && (
                  <Typography color="error" variant="caption">
                    {formErrors.type}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('stock.movements.quantity')}
                value={formData.quantity}
                onChange={(e) => handleFormChange('quantity', Number(e.target.value))}
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
                disabled={!!selectedMovement}
              />
            </Grid>
            {formData.type === 'transfer' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('stock.movements.source')}
                    value={formData.source}
                    onChange={(e) => handleFormChange('source', e.target.value)}
                    error={!!formErrors.source}
                    helperText={formErrors.source}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('stock.movements.destination')}
                    value={formData.destination}
                    onChange={(e) => handleFormChange('destination', e.target.value)}
                    error={!!formErrors.destination}
                    helperText={formErrors.destination}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('stock.movements.notes')}
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={Object.keys(formErrors).length > 0 || saving}
          >
            {saving ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>
          {actionType === 'delete' ? t('stock.movements.deleteConfirm') : t('stock.movements.cancelConfirm')}
        </DialogTitle>
        <DialogContent>
          {t(actionType === 'delete' ? 'stock.movements.deleteMessage' : 'stock.movements.cancelMessage')}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>{t('common.no')}</Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained">
            {t('common.yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Movements; 