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
  Chip,
  Fade,
  Zoom,
  CircularProgress,
  Alert,
  Collapse,
  Grow,
  Slide,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';
import GradientButton from '../components/ui/GradientButton';
import { api } from '../utils/api';
import {
  gradientText,
  pageContainer,
  tableContainer,
  tableHeader,
  dialogTitle,
  dialogPaper,
} from '../theme/gradientStyles';
import { DataTable } from '../components/ui/data-table';
import { Plus } from 'lucide-react';
import { columns } from './inventoryColumns';

interface InventoryItem {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
}

const data: InventoryItem[] = [
  {
    _id: '1',
    name: 'Office Chair',
    description: 'A comfortable office chair',
    quantity: 25,
    unitPrice: 199.99,
    category: 'Furniture',
    supplier: 'ABC Furniture',
    createdAt: '2024-04-01T10:00:00',
    updatedAt: '2024-04-01T10:00:00',
  },
  {
    _id: '2',
    name: 'Desk Lamp',
    description: 'A stylish desk lamp',
    quantity: 5,
    unitPrice: 49.99,
    category: 'Lighting',
    supplier: 'XYZ Lighting',
    createdAt: '2024-04-01T10:00:00',
    updatedAt: '2024-04-01T10:00:00',
  },
  {
    _id: '3',
    name: 'Printer Paper',
    description: 'A pack of 500 sheets of printer paper',
    quantity: 0,
    unitPrice: 9.99,
    category: 'Supplies',
    supplier: 'Office Depot',
    createdAt: '2024-04-01T10:00:00',
    updatedAt: '2024-04-01T10:00:00',
  },
];

const Inventory: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    category: '',
    supplier: ''
  });
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory');
      setItems(response.data.data.items);
    } catch (err) {
      setError('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.name || !formData.quantity || !formData.unitPrice || !formData.category || !formData.supplier) {
        throw new Error(t('inventory.validation.required'));
      }

      await api.post('/inventory', formData);
      await fetchItems();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit inventory item');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/inventory/${id}`);
      await fetchItems();
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete inventory item');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return { color: 'success.main', bg: 'success.light' };
      case 'low_stock':
        return { color: 'warning.main', bg: 'warning.light' };
      case 'out_of_stock':
        return { color: 'error.main', bg: 'error.light' };
      default:
        return { color: 'text.primary', bg: 'grey.100' };
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography
          variant="h6"
          sx={{
            opacity: 0,
            animation: 'fadeInOut 1.5s infinite',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0 },
            },
          }}
        >
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={pageContainer}>
      <Box className="page-title">
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Typography 
            variant="h4" 
            component="h1"
            sx={gradientText}
          >
            {t('inventory.title')}
          </Typography>
        </Slide>
        <Grow in={true} timeout={1000}>
          <GradientButton
            onClick={handleClickOpen}
            startIcon={<AddIcon />}
          >
            {t('inventory.addItem')}
          </GradientButton>
        </Grow>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <Fade in={true} timeout={1000}>
        <TableContainer 
          component={Paper}
          sx={tableContainer(theme)}
        >
          <Table>
            <TableHead>
              <TableRow sx={tableHeader}>
                <TableCell>{t('inventory.name')}</TableCell>
                <TableCell>{t('inventory.quantity')}</TableCell>
                <TableCell>{t('inventory.unit')}</TableCell>
                <TableCell>{t('inventory.price')}</TableCell>
                <TableCell>{t('inventory.status')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <React.Fragment key={item._id}>
                  <TableRow 
                    onClick={() => handleRowClick(item._id)}
                    onMouseEnter={() => setHoveredRow(item._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    sx={{
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'scale(1.01)',
                        '& .row-actions': {
                          transform: 'translateX(0)',
                          opacity: 1,
                        },
                      },
                      ...(expandedRow === item._id && {
                        backgroundColor: 'action.selected',
                      }),
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InventoryIcon color="primary" />
                        {item.name}
                        {expandedRow === item._id ? (
                          <ExpandLessIcon color="action" />
                        ) : (
                          <ExpandMoreIcon color="action" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={t(`inventory.${item.category}`)}
                        sx={{
                          backgroundColor: getStatusColor(item.category).bg,
                          color: getStatusColor(item.category).color,
                          fontWeight: 'medium',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box 
                        className="row-actions"
                        sx={{
                          display: 'flex',
                          gap: 1,
                          transform: 'translateX(20px)',
                          opacity: 0,
                          transition: 'all 0.3s ease-in-out',
                        }}
                      >
                        <Tooltip title={t('common.edit')} arrow TransitionComponent={Zoom}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                            sx={{
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.1) rotate(-8deg)',
                                color: 'info.main',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete')} arrow TransitionComponent={Zoom}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(item._id);
                            }}
                            sx={{
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.1) rotate(8deg)',
                                color: 'error.main',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={expandedRow === item._id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                          <Paper 
                            elevation={0}
                            sx={{ 
                              p: 2,
                              backgroundColor: 'background.paper',
                              borderRadius: 2,
                              transition: 'all 0.3s ease-in-out',
                              '&:hover': {
                                boxShadow: (theme) => theme.shadows[2],
                              },
                            }}
                          >
                            <Typography variant="subtitle1" gutterBottom>
                              {t('inventory.details')}
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {t('inventory.description')}
                                </Typography>
                                <Typography variant="body1">
                                  {item.description}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {t('inventory.supplier')}
                                </Typography>
                                <Typography variant="body1">
                                  {item.supplier}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {t('inventory.lastUpdated')}
                                </Typography>
                                <Typography variant="body1">
                                  {new Date(item.updatedAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  {deleteConfirm === item._id && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0 }}>
                        <Collapse in={true} timeout="auto">
                          <Box sx={{ p: 2, backgroundColor: 'error.light' }}>
                            <Typography variant="body2" color="error" gutterBottom>
                              {t('inventory.confirmDelete')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item._id);
                                }}
                                sx={{
                                  animation: 'shake 0.5s ease-in-out',
                                  '@keyframes shake': {
                                    '0%, 100%': { transform: 'translateX(0)' },
                                    '25%': { transform: 'translateX(-5px)' },
                                    '75%': { transform: 'translateX(5px)' },
                                  },
                                }}
                              >
                                {t('common.confirm')}
                              </Button>
                              <Button
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm(null);
                                }}
                              >
                                {t('common.cancel')}
                              </Button>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      <Dialog 
        open={open} 
        onClose={handleClose}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: dialogPaper
        }}
      >
        <DialogTitle sx={dialogTitle}>
          {t('inventory.addItem')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            pt: 2,
            '& .MuiTextField-root': {
              mb: 2,
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateX(4px)',
                  '& fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                },
              },
            },
          }}>
            <TextField
              autoFocus
              name="name"
              label={t('inventory.name')}
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              name="quantity"
              label={t('inventory.quantity')}
              type="number"
              value={formData.quantity}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              name="category"
              label={t('inventory.category')}
              value={formData.category}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              name="unitPrice"
              label={t('inventory.unitPrice')}
              type="number"
              value={formData.unitPrice}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              name="description"
              label={t('inventory.description')}
              value={formData.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
              required
            />
            <TextField
              name="supplier"
              label={t('inventory.supplier')}
              value={formData.supplier}
              onChange={handleFormChange}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {t('common.cancel')}
          </Button>
          <GradientButton onClick={handleSubmit}>
            {t('common.submit')}
          </GradientButton>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>

      <DataTable columns={columns} data={data} searchKey="name" />
    </Box>
  );
};

export default Inventory; 