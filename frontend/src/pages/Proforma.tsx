import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import api from '../services/api';

interface ProformaItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Proforma {
  _id: string;
  invoiceNumber: string;
  date: string;
  seller: {
    name: string;
    address: string;
    nif: string;
    rc: string;
    ai: string;
    iban: string;
    bank: string;
  };
  buyer: {
    name: string;
    address: string;
    companyId?: string;
  };
  items: ProformaItem[];
  subtotal: number;
  vat: number;
  totalAmount: number;
  status: 'draft' | 'finalized';
}

interface ProformaData {
  seller: {
    name: string;
    address: string;
    nif: string;
    rc: string;
    ai: string;
    iban: string;
    bank: string;
  };
  buyer: {
    name: string;
    address: string;
    companyId: string;
  };
  items: ProformaItem[];
  subtotal: number;
  vat: number;
  totalAmount: number;
}

const Proforma: React.FC = () => {
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proformaData, setProformaData] = useState<ProformaData>({
    seller: {
      name: '',
      address: '',
      nif: '',
      rc: '',
      ai: '',
      iban: '',
      bank: ''
    },
    buyer: {
      name: '',
      address: '',
      companyId: ''
    },
    items: [],
    subtotal: 0,
    vat: 0,
    totalAmount: 0
  });
  const [currentItem, setCurrentItem] = useState<ProformaItem>({
    description: '',
    quantity: 0,
    unitPrice: 0,
    total: 0
  });

  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchProformas();
  }, []);

  const fetchProformas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/proformas');
      setProformas(response.data.data.proformas);
    } catch (err) {
      setError('Failed to fetch proforma invoices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (section: 'seller' | 'buyer', field: string, value: string) => {
    setProformaData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleVatChange = (value: string) => {
    const vatAmount = Number(value) || 0;
    setProformaData(prev => ({
      ...prev,
      vat: vatAmount,
      totalAmount: prev.subtotal + vatAmount
    }));
  };

  const handleItemChange = (field: keyof ProformaItem, value: number | string) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    if (currentItem.description && currentItem.quantity > 0 && currentItem.unitPrice >= 0) {
      const total = currentItem.quantity * currentItem.unitPrice;
      setProformaData(prev => ({
        ...prev,
        items: [...prev.items, { ...currentItem, total }]
      }));
      setCurrentItem({
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      });
    }
  };

  const removeItem = (index: number) => {
    setProformaData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/proformas', proformaData);
      handleClose();
      fetchProformas();
      setProformaData({
        seller: {
          name: '',
          address: '',
          nif: '',
          rc: '',
          ai: '',
          iban: '',
          bank: '',
        },
        buyer: {
          name: '',
          address: '',
          companyId: '',
        },
        items: [],
        subtotal: 0,
        vat: 0,
        totalAmount: 0
      });
    } catch (err) {
      setError('Failed to create proforma invoice');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/proformas/${id}`);
      fetchProformas();
    } catch (err) {
      setError('Failed to delete proforma invoice');
      console.error(err);
    }
  };

  const handleFinalize = async (id: string) => {
    try {
      await api.post(`/proformas/${id}/finalize`);
      fetchProformas();
    } catch (err) {
      setError('Failed to finalize proforma invoice');
      console.error(err);
    }
  };

  const handlePrint = async (id: string) => {
    try {
      const response = await api.get(`/proformas/${id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `proforma-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to generate PDF');
      console.error(err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Proforma Invoices</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          New Proforma Invoice
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proformas.map((proforma) => (
              <TableRow key={proforma._id}>
                <TableCell>{proforma.invoiceNumber}</TableCell>
                <TableCell>{new Date(proforma.date).toLocaleDateString()}</TableCell>
                <TableCell>{proforma.buyer.name}</TableCell>
                <TableCell>{proforma.totalAmount} DZD</TableCell>
                <TableCell>
                  {proforma.status === 'draft' ? 'Draft' : 'Finalized'}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handlePrint(proforma._id)}
                    color="primary"
                  >
                    <PrintIcon />
                  </IconButton>
                  {proforma.status === 'draft' && (
                    <>
                      <IconButton
                        onClick={() => handleFinalize(proforma._id)}
                        color="success"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(proforma._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>New Proforma Invoice</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6">Seller Details</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={proformaData.seller.name}
                onChange={(e) => handleChange('seller', 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                value={proformaData.seller.address}
                onChange={(e) => handleChange('seller', 'address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NIF"
                value={proformaData.seller.nif}
                onChange={(e) => handleChange('seller', 'nif', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RC"
                value={proformaData.seller.rc}
                onChange={(e) => handleChange('seller', 'rc', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="AI"
                value={proformaData.seller.ai}
                onChange={(e) => handleChange('seller', 'ai', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IBAN"
                value={proformaData.seller.iban}
                onChange={(e) => handleChange('seller', 'iban', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank"
                value={proformaData.seller.bank}
                onChange={(e) => handleChange('seller', 'bank', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Buyer Details</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={proformaData.buyer.name}
                onChange={(e) => handleChange('buyer', 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                value={proformaData.buyer.address}
                onChange={(e) => handleChange('buyer', 'address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company ID"
                value={proformaData.buyer.companyId}
                onChange={(e) => handleChange('buyer', 'companyId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Items</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Description"
                value={currentItem.description}
                onChange={(e) => handleItemChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={currentItem.quantity}
                onChange={(e) => handleItemChange('quantity', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Unit Price (DZD)"
                value={currentItem.unitPrice}
                onChange={(e) => handleItemChange('unitPrice', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={addItem}
                startIcon={<AddIcon />}
                sx={{ height: '56px' }}
              >
                Add Item
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proformaData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice} DZD</TableCell>
                        <TableCell>{item.total} DZD</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removeItem(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="VAT (DZD)"
                value={proformaData.vat}
                onChange={(e) => handleVatChange(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Proforma;