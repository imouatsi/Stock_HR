import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Tooltip,
  Fade,
  Zoom,
  CircularProgress,
  Alert,
  Collapse,
  Grow,
  Slide,
  Card,
  CardContent,
  Divider,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';

interface ProformaInvoice {
  id: string;
  number: string;
  date: string;
  buyer: string;
  totalAmount: number;
  status: 'draft' | 'finalized';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  sellerDetails: {
    name: string;
    address: string;
    nif: string;
    rc: string;
    ai: string;
    iban: string;
    bank: string;
  };
  buyerDetails: {
    name: string;
    address: string;
    companyId: string;
  };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.3s ease',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
  },
}));

const Proforma: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<ProformaInvoice[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/proformas');
      setInvoices(response.data.data.proformaInvoices || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch proforma invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExpandRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'warning';
      case 'finalized':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={2} sx={{ animation: 'fadeInOut 1.5s infinite' }}>
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ animation: 'slideIn 0.5s ease-out' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <Typography variant="h4" gutterBottom sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            transform: 'scaleX(0)',
            transition: 'transform 0.3s ease',
          },
          '&:hover::after': {
            transform: 'scaleX(1)',
          },
        }}>
          {t('proforma.title')}
        </Typography>
      </Slide>

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <GradientButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ animation: 'grow 0.5s ease-out' }}
        >
          {t('proforma.addButton')}
        </GradientButton>
      </Box>

      <TableContainer component={Paper} sx={{ animation: 'fadeIn 0.5s ease-out' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('proforma.number')}</StyledTableCell>
              <StyledTableCell>{t('proforma.date')}</StyledTableCell>
              <StyledTableCell>{t('proforma.buyer')}</StyledTableCell>
              <StyledTableCell>{t('proforma.totalAmount')}</StyledTableCell>
              <StyledTableCell>{t('proforma.status')}</StyledTableCell>
              <StyledTableCell>{t('proforma.actions')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                <StyledTableRow
                  onMouseEnter={() => setHoveredRow(invoice.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{
                    transform: hoveredRow === invoice.id ? 'scale(1.01)' : 'scale(1)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() => handleExpandRow(invoice.id)}
                        sx={{ mr: 1 }}
                      >
                        {expandedRows.has(invoice.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      {invoice.number}
                    </Box>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.buyer}</TableCell>
                  <TableCell>{invoice.totalAmount.toLocaleString()} DZD</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`proforma.${invoice.status}`)}
                      color={getStatusColor(invoice.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title={t('common.download')}>
                        <IconButton size="small" color="primary">
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirm(invoice.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedRows.has(invoice.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          {t('proforma.details')}
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                  {t('proforma.sellerDetails')}
                                </Typography>
                                <Typography><strong>{t('proforma.name')}:</strong> {invoice.sellerDetails.name}</Typography>
                                <Typography><strong>{t('proforma.address')}:</strong> {invoice.sellerDetails.address}</Typography>
                                <Typography><strong>{t('proforma.nif')}:</strong> {invoice.sellerDetails.nif}</Typography>
                                <Typography><strong>{t('proforma.rc')}:</strong> {invoice.sellerDetails.rc}</Typography>
                                <Typography><strong>{t('proforma.ai')}:</strong> {invoice.sellerDetails.ai}</Typography>
                                <Typography><strong>{t('proforma.iban')}:</strong> {invoice.sellerDetails.iban}</Typography>
                                <Typography><strong>{t('proforma.bank')}:</strong> {invoice.sellerDetails.bank}</Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                  {t('proforma.buyerDetails')}
                                </Typography>
                                <Typography><strong>{t('proforma.name')}:</strong> {invoice.buyerDetails.name}</Typography>
                                <Typography><strong>{t('proforma.address')}:</strong> {invoice.buyerDetails.address}</Typography>
                                <Typography><strong>{t('proforma.companyId')}:</strong> {invoice.buyerDetails.companyId}</Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                  {t('proforma.items')}
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>{t('proforma.description')}</TableCell>
                                      <TableCell align="right">{t('proforma.quantity')}</TableCell>
                                      <TableCell align="right">{t('proforma.unitPrice')}</TableCell>
                                      <TableCell align="right">{t('proforma.total')}</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {invoice.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="right">{item.unitPrice.toLocaleString()} DZD</TableCell>
                                        <TableCell align="right">{item.total.toLocaleString()} DZD</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{t('proforma.addButton')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                {t('proforma.sellerDetails')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('proforma.name')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('proforma.address')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t('proforma.nif')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t('proforma.rc')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t('proforma.ai')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('proforma.iban')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('proforma.bank')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                {t('proforma.buyerDetails')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('proforma.name')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('proforma.address')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('proforma.companyId')}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                {t('proforma.items')}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('proforma.description')}</TableCell>
                      <TableCell align="right">{t('proforma.quantity')}</TableCell>
                      <TableCell align="right">{t('proforma.unitPrice')}</TableCell>
                      <TableCell align="right">{t('proforma.total')}</TableCell>
                      <TableCell align="right">{t('proforma.vat')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{ width: '100px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{ width: '120px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{ width: '120px' }}
                          disabled
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{ width: '120px' }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {}}
                >
                  {t('proforma.addItem')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <GradientButton onClick={handleClose}>
            {t('proforma.create')}
          </GradientButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('proforma.confirmDelete')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>
            {t('common.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              // Handle delete
              setDeleteConfirm(null);
            }}
            sx={{
              animation: deleteConfirm ? 'shake 0.5s ease-in-out' : 'none',
              '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(0)' },
                '25%': { transform: 'translateX(-5px)' },
                '75%': { transform: 'translateX(5px)' },
              },
            }}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Proforma;