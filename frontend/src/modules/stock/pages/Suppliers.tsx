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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTranslation } from '../../../hooks/useTranslation';
import GradientButton from '../../../components/ui/GradientButton';
import { stockService, type Supplier } from '../../../services/stockService';
import { useAuth } from '../../../hooks/useAuth';

export const Suppliers: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: '',
    paymentTerms: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await stockService.getAllSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        taxNumber: supplier.taxNumber || '',
        paymentTerms: supplier.paymentTerms || '',
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        taxNumber: '',
        paymentTerms: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
      paymentTerms: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.name) {
        throw new Error('Name is required');
      }

      if (editingSupplier) {
        await stockService.updateSupplier(editingSupplier._id, formData);
      } else {
        await stockService.createSupplier(formData);
      }

      await fetchSuppliers();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await stockService.toggleSupplierStatus(id);
      await fetchSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle supplier status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await stockService.deleteSupplier(id);
      await fetchSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete supplier');
    } finally {
      setLoading(false);
    }
  };

  if (loading && suppliers.length === 0) {
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
          {t('stock.suppliers.title')}
        </Typography>
        {user?.permissions.includes('stock:create') && (
          <GradientButton
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            {t('stock.suppliers.add')}
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
              <TableCell>{t('stock.suppliers.name')}</TableCell>
              <TableCell>{t('stock.suppliers.contactPerson')}</TableCell>
              <TableCell>{t('stock.suppliers.email')}</TableCell>
              <TableCell>{t('stock.suppliers.phone')}</TableCell>
              <TableCell>{t('stock.suppliers.status')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier._id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={supplier.status === 'active' ? t('common.active') : t('common.inactive')}
                    color={supplier.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {user?.permissions.includes('stock:update') && (
                      <>
                        <Tooltip title={t('common.edit')}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(supplier)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={supplier.status === 'active' ? t('common.deactivate') : t('common.activate')}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(supplier._id)}
                          >
                            {supplier.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {user?.permissions.includes('stock:delete') && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(supplier._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSupplier ? t('stock.suppliers.edit') : t('stock.suppliers.add')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label={t('stock.suppliers.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.suppliers.contactPerson')}
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.suppliers.email')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.suppliers.phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.suppliers.address')}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.suppliers.taxNumber')}
                value={formData.taxNumber}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.suppliers.paymentTerms')}
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <GradientButton onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 