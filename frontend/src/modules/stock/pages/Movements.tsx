import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button as MuiButton,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
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
import { useToast } from '../../../hooks/useToast';
// Using stockService instead of direct API calls
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '../../../components/ui/dialog';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';

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

interface Movement {
  _id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

interface StockItem {
  _id: string;
  name: string;
  quantity: number;
}

export const Movements: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { showToast } = useToast();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovements();
    fetchStockItems();
  }, []);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const movements = await stockService.getAllMovements();
      setMovements(movements);
      setError(null);
    } catch (err) {
      setError(t('common.error.loading'));
      showToast({
        title: t('common.error.title'),
        description: t('common.error.loading'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStockItems = async () => {
    try {
      const items = await stockService.getAllInventoryItems();
      setStockItems(items.map(item => ({
        _id: item._id,
        name: item.name,
        quantity: item.currentStock
      })));
    } catch (err) {
      showToast({
        title: t('common.error.title'),
        description: t('common.error.loading'),
        variant: 'destructive'
      });
    }
  };

  const handleFilterChange = (field: keyof MovementFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenDialog = (movement?: Movement) => {
    if (movement) {
      setSelectedMovement(movement);
      setFormData({
        inventoryItem: movement.itemName,
        quantity: movement.quantity,
        type: movement.type,
        source: '',
        destination: '',
        notes: movement.reason,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await stockService.createMovement({
        inventoryItem: formData.inventoryItem,
        quantity: formData.quantity,
        type: formData.type,
        reference: formData.source,
        notes: formData.notes
      });
      showToast({
        title: t('common.success'),
        description: t('stock.movements.createSuccess')
      });
      setOpenDialog(false);
      setFormData({
        inventoryItem: '',
        quantity: 0,
        type: 'in',
        source: '',
        destination: '',
        notes: '',
      });
      fetchMovements();
      fetchStockItems();
    } catch (err) {
      showToast({
        title: t('common.error.title'),
        description: t('common.error.save'),
        variant: 'destructive'
      });
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedMovement || !actionType) return;

    try {
      setLoading(true);
      if (actionType === 'delete') {
        await stockService.deleteMovement(selectedMovement._id);
        showToast({
          title: t('common.success'),
          description: t('stock.movements.deleteSuccess')
        });
      } else if (actionType === 'cancel') {
        await stockService.updateMovementStatus(selectedMovement._id, 'cancelled');
        showToast({
          title: t('common.success'),
          description: t('stock.movements.cancelSuccess')
        });
      }
      fetchMovements();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${actionType} movement`);
      showToast({
        title: t('common.error.title'),
        description: t('common.error.save'),
        variant: 'destructive'
      });
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

  const filteredMovements = Array.isArray(movements) ? movements.filter(movement =>
    movement.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading && (!movements || movements.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('stock.movements.title')}</h1>
        <Button onClick={() => setOpenDialog(true)}>
          {t('stock.movements.add')}
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder={t('stock.movements.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('stock.movements.item')}</TableHead>
                <TableHead>{t('stock.movements.type')}</TableHead>
                <TableHead>{t('stock.movements.quantity')}</TableHead>
                <TableHead>{t('stock.movements.date')}</TableHead>
                <TableHead>{t('stock.movements.reason')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements?.map((movement) => (
                <TableRow key={movement._id}>
                  <TableCell>{movement?.itemName}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      movement?.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {movement?.type === 'in' ? t('stock.movements.in') : t('stock.movements.out')}
                    </span>
                  </TableCell>
                  <TableCell>{movement?.quantity}</TableCell>
                  <TableCell>{movement?.date ? new Date(movement.date).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{movement?.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('stock.movements.add')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('stock.movements.item')}
              </label>
              <Select
                value={formData.inventoryItem}
                onValueChange={(value) => handleFormChange('inventoryItem', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('stock.movements.selectItem')} />
                </SelectTrigger>
                <SelectContent>
                  {stockItems.map((item) => (
                    <SelectItem key={item._id} value={item._id}>
                      {item.name} ({item.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('stock.movements.type')}
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleFormChange('type', value as 'in' | 'out')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('stock.movements.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">{t('stock.movements.in')}</SelectItem>
                  <SelectItem value="out">{t('stock.movements.out')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('stock.movements.quantity')}
              </label>
              <Input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleFormChange('quantity', parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('stock.movements.reason')}
              </label>
              <Input
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('common.add')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialog} onOpenChange={() => setConfirmDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'delete' ? t('stock.movements.deleteConfirm') : t('stock.movements.cancelConfirm')}
            </DialogTitle>
            <DialogDescription>
              {t(actionType === 'delete' ? 'stock.movements.deleteMessage' : 'stock.movements.cancelMessage')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setConfirmDialog(false)}>{t('common.no')}</Button>
            <Button onClick={handleConfirmAction} color="primary" variant="contained">
              {t('common.yes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};