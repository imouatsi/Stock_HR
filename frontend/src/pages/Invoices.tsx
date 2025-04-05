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
  IconButton
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../utils/api';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
}

const Invoices: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoiceData, setInvoiceData] = useState({
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
      const response = await api.get('/invoices');
      setInvoices(response.data.data.invoices);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch invoices');
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
      await api.post('/invoices', invoiceData);
      handleClose();
      fetchInvoices();
    } catch (err) {
      setError('Failed to create invoice');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/invoices/${id}`);
      fetchInvoices();
    } catch (err) {
      setError('Failed to delete invoice');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('invoices.title')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        sx={{ mb: 3 }}
      >
        {t('invoices.addButton')}
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('invoices.number')}</TableCell>
              <TableCell>{t('invoices.customer')}</TableCell>
              <TableCell align="right">{t('invoices.total')}</TableCell>
              <TableCell align="right">{t('invoices.status')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell align="right">${invoice.total.toFixed(2)}</TableCell>
                <TableCell align="right">{invoice.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(invoice._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{t('invoices.addInvoice')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="customerName"
            label={t('invoices.customerName')}
            type="text"
            fullWidth
            value={invoiceData.customerName}
            onChange={handleChange}
          />
          
          {invoiceData.items.map((item, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
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
              />
              <TextField
                margin="dense"
                name={`items.${index}.quantity`}
                label={t('invoices.quantity')}
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                sx={{ mr: 1 }}
              />
              <TextField
                margin="dense"
                name={`items.${index}.price`}
                label={t('invoices.price')}
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              />
              <Typography>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {t('common.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;