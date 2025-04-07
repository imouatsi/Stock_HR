import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { stockMovementService, StockMovement, StockMovementFilters, StockMovementCreateData, StockMovementUpdateData } from '../services/stockMovementService';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import StockMovementForm from '../components/StockMovementForm';

interface StockMovementFilters {
  type?: 'in' | 'out';
  itemId?: string;
  startDate?: string;
  endDate?: string;
}

const StockMovementList: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StockMovementFilters>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'cancel' | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<StockMovementCreateData | StockMovementUpdateData>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const data = await stockMovementService.getAll(filters);
      setMovements(data);
    } catch (error) {
      enqueueSnackbar('Error loading stock movements', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, [filters]);

  const handleFilterChange = (field: keyof StockMovementFilters, value: string | null) => {
    setFilters((prev: StockMovementFilters) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleOpenDialog = (movement?: StockMovement) => {
    setSelectedMovement(movement || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedMovement(null);
    setOpenDialog(false);
    setFormData({});
    setFormErrors({});
  };

  const handleConfirmAction = async () => {
    if (!selectedMovement || !actionType) return;

    try {
      if (actionType === 'delete') {
        await stockMovementService.delete(selectedMovement._id);
        enqueueSnackbar('Stock movement deleted successfully', { variant: 'success' });
      } else if (actionType === 'cancel') {
        await stockMovementService.cancel(selectedMovement._id);
        enqueueSnackbar('Stock movement cancelled successfully', { variant: 'success' });
      }
      loadMovements();
    } catch (error) {
      enqueueSnackbar(`Error ${actionType}ing stock movement`, { variant: 'error' });
    } finally {
      setConfirmDialog(false);
      setSelectedMovement(null);
      setActionType(null);
    }
  };

  const getStatusColor = (status: StockMovement['status']) => {
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

  const validateForm = (data: StockMovementCreateData | StockMovementUpdateData) => {
    const errors: Record<string, string> = {};

    if ('inventoryItem' in data && !data.inventoryItem) {
      errors.inventoryItem = 'Inventory item is required';
    }

    if ('type' in data && !data.type) {
      errors.type = 'Movement type is required';
    }

    if ('quantity' in data && (!data.quantity || data.quantity <= 0)) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    if ('type' in data && data.type === 'transfer') {
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

  const handleFormChange = (data: StockMovementCreateData | StockMovementUpdateData) => {
    setFormData(data);
    const errors = validateForm(data);
    setFormErrors(errors);
  };

  const handleSave = async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      if (selectedMovement) {
        await stockMovementService.update(selectedMovement._id, formData as StockMovementUpdateData);
        enqueueSnackbar('Stock movement updated successfully', { variant: 'success' });
      } else {
        await stockMovementService.create(formData as StockMovementCreateData);
        enqueueSnackbar('Stock movement created successfully', { variant: 'success' });
      }
      handleCloseDialog();
      loadMovements();
    } catch (error) {
      enqueueSnackbar('Error saving stock movement', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Stock Movements
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      label="Type"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="in">In</MenuItem>
                      <MenuItem value="out">Out</MenuItem>
                      <MenuItem value="transfer">Transfer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate ? new Date(filters.startDate) : null}
                    onChange={(date) => handleFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : null)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate ? new Date(filters.endDate) : null}
                    onChange={(date) => handleFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : null)}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
              >
                New Movement
              </Button>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Reference</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {movements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            No stock movements found
                          </TableCell>
                        </TableRow>
                      ) : (
                        movements.map((movement) => (
                          <TableRow key={movement._id}>
                            <TableCell>{movement.reference}</TableCell>
                            <TableCell>{movement.inventoryItem.name}</TableCell>
                            <TableCell>{movement.type}</TableCell>
                            <TableCell>{movement.quantity}</TableCell>
                            <TableCell>
                              <Chip
                                label={movement.status}
                                color={getStatusColor(movement.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{format(new Date(movement.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>
                            <TableCell>{movement.user.name}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(movement)}
                                disabled={movement.status === 'completed'}
                              >
                                <EditIcon />
                              </IconButton>
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
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>
          {actionType === 'delete' ? 'Delete Movement' : 'Cancel Movement'}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to {actionType} this movement?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>No</Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Movement Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMovement ? 'Edit Movement' : 'New Movement'}
        </DialogTitle>
        <DialogContent>
          <StockMovementForm
            movement={selectedMovement || undefined}
            onChange={handleFormChange}
            errors={formErrors}
            isEdit={!!selectedMovement}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={Object.keys(formErrors).length > 0 || saving}
          >
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockMovementList; 