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
  Grid,
  Tooltip,
  Zoom,
  useTheme,
  Fade,
  CircularProgress,
  Alert,
  Collapse,
  Chip,
  Grow,
  Slide
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { api } from '../utils/api';
import GradientButton from '../components/ui/GradientButton';

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
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return { bg: 'warning.light', color: 'warning.dark' };
      case 'active': return { bg: 'success.light', color: 'success.dark' };
      case 'expired': return { bg: 'error.light', color: 'error.dark' };
      case 'terminated': return { bg: 'grey.300', color: 'grey.700' };
      default: return { bg: 'grey.100', color: 'grey.700' };
    }
  };

  const handleRowClick = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
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
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Slide direction="down" in={true} timeout={800}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '60%',
                height: 3,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 4,
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                animation: 'slideIn 0.8s ease-out forwards',
              },
              '@keyframes slideIn': {
                to: { transform: 'scaleX(1)' },
              },
            }}
          >
            {t('contracts.title')}
          </Typography>
          <Grow in={true} timeout={1000}>
            <GradientButton
              startIcon={!isRTL && <AddIcon />}
              endIcon={isRTL && <AddIcon />}
              onClick={handleClickOpen}
            >
              {t('contracts.generateButton')}
            </GradientButton>
          </Grow>
        </Box>
      </Slide>

      <Fade in={true} timeout={1000}>
        <TableContainer 
          component={Paper}
          sx={{
            boxShadow: theme.shadows[2],
            borderRadius: 2,
            overflow: 'hidden',
            '& .MuiTableCell-root': {
              borderColor: theme.palette.divider,
            },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
              }}>
                <TableCell sx={{ width: 50, color: 'white' }}></TableCell>
                <TableCell sx={{ color: 'white' }}>{t('contracts.number')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('contracts.type')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('contracts.partyA')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('contracts.partyB')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('contracts.value')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('contracts.status')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract) => (
                <React.Fragment key={contract._id}>
                  <TableRow 
                    onClick={() => handleRowClick(contract._id)}
                    onMouseEnter={() => setHoveredRow(contract._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      backgroundColor: hoveredRow === contract._id ? 'action.hover' : 'inherit',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        '& .row-actions': {
                          transform: 'translateX(0)',
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <TableCell>
                      <IconButton size="small">
                        {expandedRow === contract._id ? 
                          <KeyboardArrowUpIcon /> : 
                          <KeyboardArrowDownIcon />
                        }
                      </IconButton>
                    </TableCell>
                    <TableCell>{contract.contractNumber}</TableCell>
                    <TableCell>{contract.contractType}</TableCell>
                    <TableCell>{contract.partyA.name}</TableCell>
                    <TableCell>{contract.partyB.name}</TableCell>
                    <TableCell align={isRTL ? 'left' : 'right'}>
                      <Chip 
                        label={`$${contract.value.toFixed(2)}`}
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell align={isRTL ? 'left' : 'right'}>
                      <Chip 
                        label={t(`contracts.${contract.status}`)}
                        sx={{
                          backgroundColor: getStatusColor(contract.status).bg,
                          color: getStatusColor(contract.status).color,
                          fontWeight: 'medium',
                        }}
                      />
                    </TableCell>
                    <TableCell align={isRTL ? 'left' : 'right'}>
                      <Box 
                        className="row-actions"
                        sx={{
                          display: 'flex',
                          gap: 1,
                          justifyContent: isRTL ? 'flex-start' : 'flex-end',
                          transform: 'translateX(20px)',
                          opacity: 0,
                          transition: 'all 0.3s ease-in-out',
                        }}
                      >
                        {deleteConfirm === contract._id ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(contract._id);
                                setDeleteConfirm(null);
                              }}
                              sx={{
                                minWidth: 0,
                                animation: 'shake 0.5s ease-in-out',
                                '@keyframes shake': {
                                  '0%, 100%': { transform: 'translateX(0)' },
                                  '25%': { transform: 'translateX(-4px)' },
                                  '75%': { transform: 'translateX(4px)' },
                                },
                              }}
                            >
                              {t('common.confirm')}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm(null);
                              }}
                            >
                              {t('common.cancel')}
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <Tooltip title={t('common.delete')} TransitionComponent={Zoom} arrow>
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm(contract._id);
                                }}
                                sx={{ 
                                  color: 'error.main',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': { 
                                    transform: 'scale(1.1) rotate(8deg)',
                                    color: 'error.dark',
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common.edit')} TransitionComponent={Zoom} arrow>
                              <IconButton
                                sx={{ 
                                  color: 'info.main',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': { 
                                    transform: 'scale(1.1) rotate(-8deg)',
                                    color: 'info.dark',
                                  },
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common.download')} TransitionComponent={Zoom} arrow>
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGenerateContract(contract._id);
                                }}
                                sx={{ 
                                  color: 'success.main',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': { 
                                    transform: 'scale(1.1) rotate(8deg)',
                                    color: 'success.dark',
                                  },
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ p: 0 }}>
                      <Collapse in={expandedRow === contract._id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: 'action.hover' }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom color="primary">
                                {t('contracts.partyA')}
                              </Typography>
                              <Box sx={{ 
                                p: 2, 
                                borderRadius: 1, 
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: 3,
                                },
                              }}>
                                <Typography><strong>{t('contracts.name')}:</strong> {contract.partyA.name}</Typography>
                                <Typography><strong>{t('contracts.address')}:</strong> {contract.partyA.address}</Typography>
                                <Typography><strong>{t('contracts.contactPerson')}:</strong> {contract.partyA.contactPerson}</Typography>
                                <Typography><strong>{t('contracts.email')}:</strong> {contract.partyA.email}</Typography>
                                <Typography><strong>{t('contracts.phone')}:</strong> {contract.partyA.phone}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom color="primary">
                                {t('contracts.partyB')}
                              </Typography>
                              <Box sx={{ 
                                p: 2, 
                                borderRadius: 1, 
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: 3,
                                },
                              }}>
                                <Typography><strong>{t('contracts.name')}:</strong> {contract.partyB.name}</Typography>
                                <Typography><strong>{t('contracts.address')}:</strong> {contract.partyB.address}</Typography>
                                <Typography><strong>{t('contracts.contactPerson')}:</strong> {contract.partyB.contactPerson}</Typography>
                                <Typography><strong>{t('contracts.email')}:</strong> {contract.partyB.email}</Typography>
                                <Typography><strong>{t('contracts.phone')}:</strong> {contract.partyB.phone}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="h6" gutterBottom color="primary">
                                {t('contracts.terms')}
                              </Typography>
                              <Box sx={{ 
                                p: 2, 
                                borderRadius: 1, 
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                whiteSpace: 'pre-wrap',
                              }}>
                                {contract.terms}
                              </Box>
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
      </Fade>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {t('contracts.generateContract')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="contractType"
                label={t('contracts.contractType')}
                type="text"
                fullWidth
                value={contractData.contractType}
                onChange={handleChange}
                sx={{
                  '& .MuiInputLabel-root': {
                    textAlign: isRTL ? 'right' : 'left',
                    transformOrigin: isRTL ? 'right' : 'left',
                  },
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                {t('contracts.partyA')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label={t('contracts.name')}
                    value={contractData.partyA.name}
                    onChange={(e) => handleChange(e, 'partyA')}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="address"
                    label={t('contracts.address')}
                    value={contractData.partyA.address}
                    onChange={(e) => handleChange(e, 'partyA')}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="contactPerson"
                    label={t('contracts.contactPerson')}
                    value={contractData.partyA.contactPerson}
                    onChange={(e) => handleChange(e, 'partyA')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="email"
                    label={t('contracts.email')}
                    type="email"
                    value={contractData.partyA.email}
                    onChange={(e) => handleChange(e, 'partyA')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="phone"
                    label={t('contracts.phone')}
                    value={contractData.partyA.phone}
                    onChange={(e) => handleChange(e, 'partyA')}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                {t('contracts.partyB')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label={t('contracts.name')}
                    value={contractData.partyB.name}
                    onChange={(e) => handleChange(e, 'partyB')}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="address"
                    label={t('contracts.address')}
                    value={contractData.partyB.address}
                    onChange={(e) => handleChange(e, 'partyB')}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="contactPerson"
                    label={t('contracts.contactPerson')}
                    value={contractData.partyB.contactPerson}
                    onChange={(e) => handleChange(e, 'partyB')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="email"
                    label={t('contracts.email')}
                    type="email"
                    value={contractData.partyB.email}
                    onChange={(e) => handleChange(e, 'partyB')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="phone"
                    label={t('contracts.phone')}
                    value={contractData.partyB.phone}
                    onChange={(e) => handleChange(e, 'partyB')}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="terms"
                label={t('contracts.terms')}
                value={contractData.terms}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="startDate"
                label={t('contracts.startDate')}
                type="date"
                value={contractData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="endDate"
                label={t('contracts.endDate')}
                type="date"
                value={contractData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="value"
                label={t('contracts.value')}
                type="number"
                value={contractData.value}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{
              mr: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            {t('contracts.cancel')}
          </Button>
          <GradientButton onClick={handleSubmit}>
            {t('contracts.submit')}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contracts;