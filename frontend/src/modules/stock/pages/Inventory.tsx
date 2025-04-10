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
} from '@mui/icons-material';
import { useTranslation } from '../../../hooks/useTranslation';
import GradientButton from '../../../components/ui/GradientButton';
import { stockService, type InventoryItem, type StockCategory } from '../../../services/stockService';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const Inventory: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<StockCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    minStock: 0,
    maxStock: 0,
    currentStock: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        stockService.getAllInventoryItems(),
        stockService.getAllCategories(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        category: item.category._id,
        unit: item.unit,
        minStock: item.minStock,
        maxStock: item.maxStock,
        currentStock: item.currentStock,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        unit: '',
        minStock: 0,
        maxStock: 0,
        currentStock: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: '',
      minStock: 0,
      maxStock: 0,
      currentStock: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.name || !formData.category || !formData.unit) {
        throw new Error(t('stock.inventory.error.requiredFields'));
      }

      if (editingItem) {
        await stockService.updateInventoryItem(editingItem._id, formData);
      } else {
        await stockService.createInventoryItem(formData);
      }

      await fetchData();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('stock.inventory.error.save'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('stock.inventory.deleteConfirm'))) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await stockService.deleteInventoryItem(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    handleOpen();
  };

  if (loading && (!items || items.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const canCreate = user?.permissions?.includes('stock:create') ?? false;
  const canUpdate = user?.permissions?.includes('stock:update') ?? false;
  const canDelete = user?.permissions?.includes('stock:delete') ?? false;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('stock.inventory.title')}
        </Typography>
        {canCreate && (
          <GradientButton
            startIcon={<AddIcon />}
            onClick={handleAddItem}
          >
            {t('stock.inventory.addItem')}
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
              <TableCell>{t('stock.inventory.name')}</TableCell>
              <TableCell>{t('stock.inventory.category')}</TableCell>
              <TableCell>{t('stock.inventory.unit')}</TableCell>
              <TableCell>{t('stock.inventory.currentStock')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.category?.name}</TableCell>
                <TableCell>{item?.unit}</TableCell>
                <TableCell>{item?.currentStock}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {canUpdate && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(item)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canDelete && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item._id)}
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
          {editingItem ? t('stock.inventory.edit') : t('stock.inventory.add')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label={t('stock.inventory.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.inventory.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>{t('stock.inventory.category')}</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e: SelectChangeEvent) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  label={t('stock.inventory.category')}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.inventory.unit')}
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('stock.inventory.minStock')}
                type="number"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData({ ...formData, minStock: Number(e.target.value) })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('stock.inventory.maxStock')}
                type="number"
                value={formData.maxStock}
                onChange={(e) =>
                  setFormData({ ...formData, maxStock: Number(e.target.value) })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('stock.inventory.currentStock')}
                type="number"
                value={formData.currentStock}
                onChange={(e) =>
                  setFormData({ ...formData, currentStock: Number(e.target.value) })
                }
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

export default Inventory;