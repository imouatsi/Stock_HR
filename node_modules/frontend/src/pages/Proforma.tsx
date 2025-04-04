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
  Tooltip,
  Zoom,
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
  const [formData, setFormData] = useState<Omit<ProformaItem, 'id'>>({
    number: '',
    date: '',
    client: '',
    total: 0,
    status: 'draft',
  });

  const handleOpen = (proforma?: ProformaItem) => {
    if (proforma) {
      setSelectedProforma(proforma);
      const { id, ...rest } = proforma;
      setFormData(rest);
    } else {
      setSelectedProforma(null);
      setFormData({
        number: '',
        date: new Date().toISOString().split('T')[0], // Default to today's date
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
    if (!formData.number || !formData.client || formData.total <= 0) {
      alert('Please fill in all required fields and ensure total is greater than 0.');
      return;
    }

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
    if (window.confirm('Are you sure you want to delete this proforma invoice?')) {
      setProformas(proformas.filter(item => item.id !== id));
    }
  };

  const handleExportPdf = (id: string) => {
    const proforma = proformas.find(item => item.id === id);
    if (!proforma) return;

    // Use jsPDF or react-pdf to generate the PDF
    alert(`Exporting Proforma Invoice #${proforma.number} to PDF.`);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="primary">
          Proforma Invoices
        </Typography>
        <Tooltip title="Create a new proforma invoice" arrow TransitionComponent={Zoom}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            New Proforma
          </Button>
        </Tooltip>
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
                  <Tooltip title="Edit" arrow TransitionComponent={Zoom}>
                    <IconButton onClick={() => handleOpen(proforma)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
                    <IconButton onClick={() => handleDelete(proforma.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export as PDF" arrow TransitionComponent={Zoom}>
                    <IconButton onClick={() => handleExportPdf(proforma.id)} color="secondary">
                      <PdfIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedProforma ? 'Edit Proforma' : 'New Proforma'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Number"
            fullWidth
            margin="normal"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <TextField
            label="Client"
            fullWidth
            margin="normal"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          />
          <TextField
            label="Total"
            type="number"
            fullWidth
            margin="normal"
            value={formData.total}
            onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) })}
          />
          <TextField
            label="Status"
            fullWidth
            margin="normal"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Proforma;