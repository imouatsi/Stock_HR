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
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useTranslation } from '../../../hooks/useTranslation';
import GradientButton from '../../../components/ui/GradientButton';
import { api } from '../../../utils/api';
import {
  gradientText,
  pageContainer,
  tableContainer,
  tableHeader,
  dialogTitle,
  dialogPaper,
} from '../../../theme/gradientStyles';

interface StockItem {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
  reorderPoint: number;
  location: string;
  lastRestocked: string;
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
  reorderPoint: number;
  location: string;
}

interface Filters {
  search: string;
  category: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const StockList: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [items, setItems] = useState<StockItem[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    category: '',
    supplier: '',
    reorderPoint: 0,
    location: ''
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stock', { params: filters });
      setItems(response.data.data.items);
    } catch (err) {
      setError('Failed to fetch stock items');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      category: '',
      supplier: '',
      reorderPoint: 0,
      location: ''
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' || name === 'reorderPoint' ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!formData.name || !formData.quantity || !formData.unitPrice || !formData.category || !formData.supplier) {
        throw new Error(t('stock.validation.required'));
      }

      await api.post('/stock', formData);
      await fetchItems();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit stock item');
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
      await api.delete(`/stock/${id}`);
      await fetchItems();
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete stock item');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (quantity: number, reorderPoint: number) => {
    if (quantity <= 0) return { color: 'error.main', bg: 'error.light', label: 'Out of Stock' };
    if (quantity <= reorderPoint) return { color: 'warning.main', bg: 'warning.light', label: 'Low Stock' };
    return { color: 'success.main', bg: 'success.light', label: 'In Stock' };
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
            {t('stock.title')}
          </Typography>
        </Slide>
        <Grow in={true} timeout={1000}>
          <GradientButton
            onClick={handleClickOpen}
            startIcon={<AddIcon />}
          >
            {t('stock.addItem')}
          </GradientButton>
        </Grow>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="search"
              label={t('common.search')}
              value={filters.search}
              onChange={handleFilterTextChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>{t('stock.category')}</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterSelectChange}
                label={t('stock.category')}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value="raw_materials">Raw Materials</MenuItem>
                <MenuItem value="finished_goods">Finished Goods</MenuItem>
                <MenuItem value="packaging">Packaging</MenuItem>
                <MenuItem value="spare_parts">Spare Parts</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>{t('common.sortBy')}</InputLabel>
              <Select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterSelectChange}
                label={t('common.sortBy')}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="quantity">Quantity</MenuItem>
                <MenuItem value="unitPrice">Price</MenuItem>
                <MenuItem value="category">Category</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Fade in={true}>
        <TableContainer 
          component={Paper}
          sx={tableContainer(theme)}
        >
          <Table>
            <TableHead>
              <TableRow sx={tableHeader}>
                <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  {t('stock.name')}
                  {filters.sortBy === 'name' && (
                    <SortIcon 
                      sx={{ 
                        ml: 1,
                        transform: filters.sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  )}
                </TableCell>
                <TableCell onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                  {t('stock.quantity')}
                  {filters.sortBy === 'quantity' && (
                    <SortIcon 
                      sx={{ 
                        ml: 1,
                        transform: filters.sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  )}
                </TableCell>
                <TableCell>{t('stock.location')}</TableCell>
                <TableCell onClick={() => handleSort('unitPrice')} style={{ cursor: 'pointer' }}>
                  {t('stock.price')}
                  {filters.sortBy === 'unitPrice' && (
                    <SortIcon 
                      sx={{ 
                        ml: 1,
                        transform: filters.sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  )}
                </TableCell>
                <TableCell>{t('stock.status')}</TableCell>
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
                    <TableCell>{item.location}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusColor(item.quantity, item.reorderPoint).label}
                        sx={{
                          backgroundColor: getStatusColor(item.quantity, item.reorderPoint).bg,
                          color: getStatusColor(item.quantity, item.reorderPoint).color,
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
                  {expandedRow === item._id && (
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
                                {t('stock.details')}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {t('stock.description')}
                                    </Typography>
                                    <Typography variant="body1">
                                      {item.description}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {t('stock.supplier')}
                                    </Typography>
                                    <Typography variant="body1">
                                      {item.supplier}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {t('stock.reorderPoint')}
                                    </Typography>
                                    <Typography variant="body1">
                                      {item.reorderPoint}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {t('stock.lastRestocked')}
                                    </Typography>
                                    <Typography variant="body1">
                                      {new Date(item.lastRestocked).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                  {deleteConfirm === item._id && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0 }}>
                        <Collapse in={true} timeout="auto">
                          <Box sx={{ p: 2, backgroundColor: 'error.light' }}>
                            <Typography variant="body2" color="error" gutterBottom>
                              {t('stock.confirmDelete')}
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
          {t('stock.addItem')}
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  name="name"
                  label={t('stock.name')}
                  value={formData.name}
                  onChange={handleTextChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="quantity"
                  label={t('stock.quantity')}
                  type="number"
                  value={formData.quantity}
                  onChange={handleTextChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="unitPrice"
                  label={t('stock.unitPrice')}
                  type="number"
                  value={formData.unitPrice}
                  onChange={handleTextChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t('stock.category')}</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                    label={t('stock.category')}
                  >
                    <MenuItem value="raw_materials">Raw Materials</MenuItem>
                    <MenuItem value="finished_goods">Finished Goods</MenuItem>
                    <MenuItem value="packaging">Packaging</MenuItem>
                    <MenuItem value="spare_parts">Spare Parts</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="location"
                  label={t('stock.location')}
                  value={formData.location}
                  onChange={handleTextChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="reorderPoint"
                  label={t('stock.reorderPoint')}
                  type="number"
                  value={formData.reorderPoint}
                  onChange={handleTextChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="supplier"
                  label={t('stock.supplier')}
                  value={formData.supplier}
                  onChange={handleTextChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label={t('stock.description')}
                  value={formData.description}
                  onChange={handleTextChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
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

export default StockList; 