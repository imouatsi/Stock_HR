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
  Grid
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { api } from '../utils/api';

interface Contract {
  _id: string;
  contractNumber: string;
  contractType: string;
  partyA: {
    name: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  partyB: {
    name: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  terms: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
}

const Contracts: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contractData, setContractData] = useState({
    contractType: '',
    partyA: {
      name: '',
      address: '',
      contactPerson: '',
      email: '',
      phone: '',
    },
    partyB: {
      name: '',
      address: '',
      contactPerson: '',
      email: '',
      phone: '',
    },
    terms: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    value: 0,
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await api.get('/contracts');
      setContracts(response.data.data.contracts);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch contracts');
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setContractData({
      contractType: '',
      partyA: {
        name: '',
        address: '',
        contactPerson: '',
        email: '',
        phone: '',
      },
      partyB: {
        name: '',
        address: '',
        contactPerson: '',
        email: '',
        phone: '',
      },
      terms: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      value: 0,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    party?: 'partyA' | 'partyB'
  ) => {
    if (party) {
      setContractData({
        ...contractData,
        [party]: {
          ...contractData[party],
          [e.target.name]: e.target.value
        }
      });
    } else {
      setContractData({
        ...contractData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/contracts', contractData);
      handleClose();
      fetchContracts();
    } catch (err) {
      setError('Failed to create contract');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/contracts/${id}`);
      fetchContracts();
    } catch (err) {
      setError('Failed to delete contract');
    }
  };

  const handleGenerateContract = async (id: string) => {
    try {
      const response = await api.get(`/contracts/${id}/generate`);
      // Handle the response - this might be a PDF or other document format
      console.log('Contract generated:', response.data);
    } catch (err) {
      setError('Failed to generate contract');
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
        {t('contracts.title')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        sx={{ mb: 3 }}
      >
        {t('contracts.generateButton')}
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('contracts.number')}</TableCell>
              <TableCell>{t('contracts.type')}</TableCell>
              <TableCell>{t('contracts.partyA')}</TableCell>
              <TableCell>{t('contracts.partyB')}</TableCell>
              <TableCell align="right">{t('contracts.value')}</TableCell>
              <TableCell align="right">{t('contracts.status')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract._id}>
                <TableCell>{contract.contractNumber}</TableCell>
                <TableCell>{contract.contractType}</TableCell>
                <TableCell>{contract.partyA.name}</TableCell>
                <TableCell>{contract.partyB.name}</TableCell>
                <TableCell align="right">${contract.value.toFixed(2)}</TableCell>
                <TableCell align="right">{contract.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(contract._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleGenerateContract(contract._id)}>
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{t('contracts.generateContract')}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="contractType"
            label={t('contracts.contractType')}
            type="text"
            fullWidth
            value={contractData.contractType}
            onChange={handleChange}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('contracts.partyA')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="name"
                label={t('contracts.name')}
                type="text"
                fullWidth
                value={contractData.partyA.name}
                onChange={(e) => handleChange(e, 'partyA')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="address"
                label={t('contracts.address')}
                type="text"
                fullWidth
                value={contractData.partyA.address}
                onChange={(e) => handleChange(e, 'partyA')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="contactPerson"
                label={t('contracts.contactPerson')}
                type="text"
                fullWidth
                value={contractData.partyA.contactPerson}
                onChange={(e) => handleChange(e, 'partyA')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="email"
                label={t('contracts.email')}
                type="email"
                fullWidth
                value={contractData.partyA.email}
                onChange={(e) => handleChange(e, 'partyA')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="phone"
                label={t('contracts.phone')}
                type="tel"
                fullWidth
                value={contractData.partyA.phone}
                onChange={(e) => handleChange(e, 'partyA')}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('contracts.partyB')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="name"
                label={t('contracts.name')}
                type="text"
                fullWidth
                value={contractData.partyB.name}
                onChange={(e) => handleChange(e, 'partyB')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="address"
                label={t('contracts.address')}
                type="text"
                fullWidth
                value={contractData.partyB.address}
                onChange={(e) => handleChange(e, 'partyB')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="contactPerson"
                label={t('contracts.contactPerson')}
                type="text"
                fullWidth
                value={contractData.partyB.contactPerson}
                onChange={(e) => handleChange(e, 'partyB')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="email"
                label={t('contracts.email')}
                type="email"
                fullWidth
                value={contractData.partyB.email}
                onChange={(e) => handleChange(e, 'partyB')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="phone"
                label={t('contracts.phone')}
                type="tel"
                fullWidth
                value={contractData.partyB.phone}
                onChange={(e) => handleChange(e, 'partyB')}
              />
            </Grid>
          </Grid>

          <TextField
            margin="dense"
            name="terms"
            label={t('contracts.terms')}
            type="text"
            fullWidth
            multiline
            rows={4}
            value={contractData.terms}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="startDate"
                label={t('contracts.startDate')}
                type="date"
                fullWidth
                value={contractData.startDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="endDate"
                label={t('contracts.endDate')}
                type="date"
                fullWidth
                value={contractData.endDate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <TextField
            margin="dense"
            name="value"
            label={t('contracts.value')}
            type="number"
            fullWidth
            value={contractData.value}
            onChange={handleChange}
            sx={{ mt: 2 }}
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

export default Contracts;