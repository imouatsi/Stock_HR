import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

interface ProformaItem {
  id: string;
  number: string;
  date: string;
  client: string;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

const Proforma: React.FC = () => {
  const [proformas, setProformas] = useState<ProformaItem[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProforma, setSelectedProforma] = useState<ProformaItem | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    date: '',
    client: '',
    total: 0,
    status: 'draft' as const,
  });

  const handleOpen = (proforma?: ProformaItem) => {
    if (proforma) {
      setSelectedProforma(proforma);
      setFormData(proforma);
    } else {
      setSelectedProforma(null);
      setFormData({
        number: '',
        date: '',
        client: '',
        total: 0,
        status: 'draft',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProforma(null);
  };

  const handleSubmit = () => {
    if (selectedProforma) {
      setProformas(proformas.map(item =>
        item.id === selectedProforma.id ? { ...item, ...formData } : item
      ));
    } else {
      setProformas([...proformas, { ...formData, id: Date.now().toString() }]);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    setProformas(proformas.filter(item => item.id !== id));
  };

  const handleExportPdf = (id: string) => {
    // TODO: Implement PDF export
    console.log('Export PDF for proforma:', id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Proforma Invoices
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Proforma
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proformas.map((proforma) => (
              <TableRow key={proforma.id}>
                <TableCell>{proforma.number}</TableCell>
                <TableCell>{proforma.date}</TableCell>
                <TableCell>{proforma.client}</TableCell>
                <TableCell align="right">${proforma.total.toFixed(2)}</TableCell>
                <TableCell>{proforma.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(proforma)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(proforma.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleExportPdf(proforma.id)}>
                    <PdfIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedProforma ? 'Edit Proforma' : 'New Proforma'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              fullWidth
            />
            <TextField
              label="Total"
              type="number"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedProforma ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Proforma; 