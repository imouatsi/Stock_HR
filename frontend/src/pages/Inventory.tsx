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

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  description?: string;
  lastUpdated?: string;
  supplier?: string;
}

const Inventory: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([
    { 
      id: '1', 
      name: 'Item 1', 
      quantity: 100, 
      unit: 'pcs', 
      price: 10.99, 
      status: 'in_stock',
      description: 'High-quality product with excellent durability',
      lastUpdated: '2023-05-15',
      supplier: 'Supplier A'
    },
    { 
      id: '2', 
      name: 'Item 2', 
      quantity: 5, 
      unit: 'pcs', 
      price: 25.50, 
      status: 'low_stock',
      description: 'Premium grade material with extended warranty',
      lastUpdated: '2023-05-10',
      supplier: 'Supplier B'
    },
    { 
      id: '3', 
      name: 'Item 3', 
      quantity: 0, 
      unit: 'pcs', 
      price: 15.75, 
      status: 'out_of_stock',
      description: 'Standard quality product for general use',
      lastUpdated: '2023-05-05',
      supplier: 'Supplier C'
    },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    try {
      // TODO: Implement actual submission logic
      setLoading(true);
      // Mock successful submission
      setTimeout(() => {
        setItems([...items]);
        handleClose();
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to submit inventory item');
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '100%',
                height: 2,
                background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease-in-out',
              },
              '&:hover::after': {
                transform: 'scaleX(1)',
              },
            }}
          >
            {t('inventory.title')}
          </Typography>
        </Slide>
        <Grow in={true} timeout={1000}>
          <GradientButton
            onClick={handleClickOpen}
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
          sx={{
            boxShadow: (theme) => theme.shadows[2],
            borderRadius: 2,
            overflow: 'hidden',
            '& .MuiTableCell-root': {
              borderColor: (theme) => theme.palette.divider,
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
                <TableCell sx={{ color: 'white' }}>{t('inventory.name')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('inventory.quantity')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('inventory.unit')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('inventory.price')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('inventory.status')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow 
                    onClick={() => handleRowClick(item.id)}
                    onMouseEnter={() => setHoveredRow(item.id)}
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
                      ...(expandedRow === item.id && {
                        backgroundColor: 'action.selected',
                      }),
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InventoryIcon color="primary" />
                        {item.name}
                        {expandedRow === item.id ? (
                          <ExpandLessIcon color="action" />
                        ) : (
                          <ExpandMoreIcon color="action" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={t(`inventory.${item.status}`)}
                        sx={{
                          backgroundColor: getStatusColor(item.status).bg,
                          color: getStatusColor(item.status).color,
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
                            onClick={(e) => handleDeleteClick(item.id, e)}
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
                      <Collapse in={expandedRow === item.id} timeout="auto" unmountOnExit>
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
                                  {item.lastUpdated}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  {deleteConfirm === item.id && (
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
                                  // Handle delete confirmation
                                  setDeleteConfirm(null);
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
          sx: {
            borderRadius: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            },
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          fontWeight: 600,
        }}>
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
              label={t('inventory.name')}
              fullWidth
            />
            <TextField
              label={t('inventory.quantity')}
              type="number"
              fullWidth
            />
            <TextField
              label={t('inventory.unit')}
              fullWidth
            />
            <TextField
              label={t('inventory.price')}
              type="number"
              fullWidth
            />
            <TextField
              label={t('inventory.description')}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label={t('inventory.supplier')}
              fullWidth
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
    </Box>
  );
};

export default Inventory; 