import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
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
  useMediaQuery
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
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

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceFormData {
  customerName: string;
  items: InvoiceItem[];
  tax: number;
  dueDate: string;
}

const Invoices: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData>({
    customerName: '',
    items: [{
      description: '',
      quantity: 0,
      price: 0,
      total: 0
    }],
    tax: 0,
    dueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/invoices');
      setInvoices(response.data.data.invoices);
    } catch (err) {
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInvoiceData({
      customerName: '',
      items: [{
        description: '',
        quantity: 0,
        price: 0,
        total: 0
      }],
      tax: 0,
      dueDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total: field === 'quantity' || field === 'price'
        ? Number(newItems[index].quantity) * Number(newItems[index].price)
        : newItems[index].total
    };
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          description: '',
          quantity: 0,
          price: 0,
          total: 0
        }
      ]
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate form data
      if (!invoiceData.customerName || invoiceData.items.length === 0) {
        throw new Error(t('invoices.validation.required'));
      }

      // Validate items
      for (const item of invoiceData.items) {
        if (!item.description || item.quantity <= 0 || item.price <= 0) {
          throw new Error(t('invoices.validation.itemsRequired'));
        }
      }

      await api.post('/invoices', invoiceData);
      await fetchInvoices();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/invoices/${id}`);
      await fetchInvoices();
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDeleteClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteConfirm(deleteConfirm === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'default';
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

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
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
            {t('invoices.title')}
          </Typography>
        </Slide>
        <Grow in={true} timeout={1000}>
          <GradientButton
            onClick={handleClickOpen}
            startIcon={<AddIcon />}
          >
            {t('invoices.createNew')}
          </GradientButton>
        </Grow>
      </Box>

      <Fade in={true} timeout={1000}>
        <TableContainer 
          component={Paper}
          sx={tableContainer(theme)}
        >
          <Table>
            <TableHead>
              <TableRow sx={tableHeader}>
                <TableCell>{t('invoices.number')}</TableCell>
                <TableCell>{t('invoices.customer')}</TableCell>
                <TableCell>{t('invoices.date')}</TableCell>
                <TableCell>{t('invoices.amount')}</TableCell>
                <TableCell>{t('invoices.status')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <React.Fragment key={invoice._id}>
                  <TableRow 
                    onClick={() => handleRowClick(invoice._id)}
                    onMouseEnter={() => setHoveredRow(invoice._id)}
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
                      ...(expandedRow === invoice._id && {
                        backgroundColor: 'action.selected',
                      }),
                    }}
                  >
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`$${invoice.total.toFixed(2)}`}
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={t(`invoices.${invoice.status.toLowerCase()}`)}
                        color={getStatusColor(invoice.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box 
                        className="row-actions"
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end',
                          transform: 'translateX(20px)',
                          opacity: 0,
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <Tooltip title={t('common.download')} arrow TransitionComponent={Zoom}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            sx={{ 
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.edit')} arrow TransitionComponent={Zoom}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            sx={{ 
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete')} arrow TransitionComponent={Zoom}>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={(e) => handleDeleteClick(invoice._id, e)}
                            sx={{ 
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.1)',
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
                      <Collapse in={expandedRow === invoice._id} timeout="auto" unmountOnExit>
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
                              {t('invoices.details')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {t('invoices.customer')}
                                </Typography>
                                <Typography variant="body1">
                                  {invoice.customerName}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {t('invoices.dueDate')}
                                </Typography>
                                <Typography variant="body1">
                                  {new Date(invoice.dueDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {t('invoices.status')}
                                </Typography>
                                <Chip 
                                  label={t(`invoices.${invoice.status.toLowerCase()}`)}
                                  color={getStatusColor(invoice.status)}
                                  size="small"
                                />
                              </Box>
                            </Box>
                          </Paper>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={deleteConfirm === invoice._id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                          <Paper 
                            elevation={0}
                            sx={{ 
                              p: 2,
                              backgroundColor: 'background.paper',
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'error.main',
                            }}
                          >
                            <Typography variant="subtitle1" color="error" gutterBottom>
                              {t('invoices.confirmDelete')}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                              <Button 
                                variant="outlined" 
                                onClick={() => setDeleteConfirm(null)}
                              >
                                {t('common.cancel')}
                              </Button>
                              <Button 
                                variant="contained" 
                                color="error"
                                onClick={() => handleDelete(invoice._id)}
                                sx={{
                                  animation: deleteConfirm === invoice._id ? 'shake 0.5s ease-in-out' : 'none',
                                  '@keyframes shake': {
                                    '0%, 100%': { transform: 'translateX(0)' },
                                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                                    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
                                  },
                                }}
                              >
                                {t('common.confirm')}
                              </Button>
                            </Box>
                          </Paper>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
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
          {t('invoices.createNew')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            name="customerName"
            label={t('invoices.customerName')}
            type="text"
            fullWidth
            value={invoiceData.customerName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          
          {invoiceData.items.map((item, index) => (
            <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('invoices.item')} #{index + 1}
              </Typography>
              <TextField
                margin="dense"
                name={`items.${index}.description`}
                label={t('invoices.description')}
                type="text"
                fullWidth
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  margin="dense"
                  name={`items.${index}.quantity`}
                  label={t('invoices.quantity')}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  margin="dense"
                  name={`items.${index}.price`}
                  label={t('invoices.price')}
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  sx={{ flex: 1 }}
                />
              </Box>
              <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
                {t('invoices.total')}: ${item.total.toFixed(2)}
              </Typography>
            </Box>
          ))}
          
          <Button
            variant="outlined"
            onClick={handleAddItem}
            sx={{ mt: 2 }}
          >
            {t('invoices.addItem')}
          </Button>

          <TextField
            margin="dense"
            name="tax"
            label={t('invoices.tax')}
            type="number"
            value={invoiceData.tax}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            margin="dense"
            name="dueDate"
            label={t('invoices.dueDate')}
            type="date"
            value={invoiceData.dueDate}
            onChange={handleChange}
            sx={{ mt: 2 }}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <GradientButton onClick={handleSubmit}>
            {t('common.submit')}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;