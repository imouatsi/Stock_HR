import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useToast } from '../../../hooks/useToast';
import api, { getApiResponse, handleApiError } from '../../../utils/api';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { Label } from '@/components/ui/label';

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

const INITIAL_FORM_DATA: FormData = {
  name: '',
  description: '',
  quantity: 0,
  unitPrice: 0,
  category: '',
  supplier: '',
  reorderPoint: 0,
  location: ''
};

const INITIAL_FILTERS: Filters = {
  search: '',
  category: '',
  sortBy: 'name',
  sortOrder: 'asc'
};

const MOCK_CATEGORIES = ['Electronics', 'Furniture', 'Office Supplies', 'Books', 'Stationery'];
const MOCK_SUPPLIERS = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];

export function StockList() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [items, setItems] = useState<StockItem[]>([]);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchSuppliers();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stock', { params: filters });
      setItems(response.data);
      setError(null);
    } catch (error) {
      setError(t('common.error'));
      toast({
        title: t('common.error'),
        description: t('stock.errors.fetchFailed'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/stock/categories');
      setCategories(response.data || MOCK_CATEGORIES);
    } catch (error) {
      // Silently fall back to mock data
      setCategories(MOCK_CATEGORIES);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/stock/suppliers');
      setSuppliers(response.data || MOCK_SUPPLIERS);
    } catch (error) {
      // Silently fall back to mock data
      setSuppliers(MOCK_SUPPLIERS);
    }
  };

  const handleClickOpen = () => {
    setFormData(INITIAL_FORM_DATA);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(INITIAL_FORM_DATA);
    setError(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' || name === 'reorderPoint' 
        ? Number(value) || 0
        : value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
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

  const handleFilterSelectChange = (value: string, name: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value === 'all' ? '' : value
    }));
  };

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.quantity || !formData.unitPrice || !formData.category || !formData.supplier) {
      throw new Error(t('stock.validation.required'));
    }
    if (formData.quantity < 0 || formData.unitPrice < 0 || formData.reorderPoint < 0) {
      throw new Error(t('stock.validation.numberPositive'));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      validateForm();

      if (selectedItem) {
        await api.put(`/stock/${selectedItem._id}`, formData);
        toast({
          title: t('common.success'),
          description: t('stock.messages.updateSuccess'),
        });
      } else {
        await api.post('/stock', formData);
        toast({
          title: t('common.success'),
          description: t('stock.messages.createSuccess'),
        });
      }

      await fetchItems();
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('stock.errors.submitFailed');
      setError(message);
      toast({
        title: t('common.error'),
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: StockItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      category: item.category,
      supplier: item.supplier,
      reorderPoint: item.reorderPoint,
      location: item.location
    });
    setOpen(true);
  };

  const handleDelete = async (item: StockItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      await api.delete(`/stock/${selectedItem._id}`);
      toast({
        title: t('common.success'),
        description: t('stock.messages.deleteSuccess'),
      });
      await fetchItems();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('stock.errors.deleteFailed'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleRowClick = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusColor = (quantity: number, reorderPoint: number): string => {
    if (quantity <= 0) return 'destructive';
    if (quantity <= reorderPoint) return 'warning';
    return 'success';
  };

  const getStatusText = (quantity: number, reorderPoint: number): string => {
    if (quantity <= 0) return t('stock.status.outOfStock');
    if (quantity <= reorderPoint) return t('stock.status.lowStock');
    return t('stock.status.inStock');
  };

  const filteredItems = items
    .filter(item => 
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase())
    )
    .filter(item => 
      filters.category ? item.category === filters.category : true
    )
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      return a[filters.sortBy as keyof StockItem] > b[filters.sortBy as keyof StockItem] ? order : -order;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh] gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="text-2xl font-bold opacity-0 animate-fadeInOut">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t('stock.title')}</CardTitle>
          <Button onClick={handleClickOpen}>
            <Plus className="mr-2 h-4 w-4" />
            {t('stock.addItem')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-4">
              <div className="flex-1">
                <Input
                  name="search"
                  placeholder={t('stock.filters.search')}
                  value={filters.search}
                  onChange={handleFilterTextChange}
                  className="w-full"
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="w-48">
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterSelectChange(value, 'category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('stock.filters.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('stock.filters.all')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                      {t('stock.fields.name')}
                      {filters.sortBy === 'name' && (
                        filters.sortOrder === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
                      {t('stock.fields.quantity')}
                      {filters.sortBy === 'quantity' && (
                        filters.sortOrder === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                      {t('stock.fields.category')}
                      {filters.sortBy === 'category' && (
                        filters.sortOrder === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead onClick={() => handleSort('supplier')} className="cursor-pointer">
                      {t('stock.fields.supplier')}
                      {filters.sortBy === 'supplier' && (
                        filters.sortOrder === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t('common.loading')}
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t('common.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <React.Fragment key={item._id}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() => handleRowClick(item._id)}
                          onMouseEnter={() => setHoveredRow(item._id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(item.quantity, item.reorderPoint)}>
                              {item.quantity} - {getStatusText(item.quantity, item.reorderPoint)}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedRow === item._id && (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <div className="p-4 space-y-2">
                                <p><strong>{t('stock.fields.description')}:</strong> {item.description}</p>
                                <p><strong>{t('stock.fields.unitPrice')}:</strong> {item.unitPrice} DZD</p>
                                <p><strong>{t('stock.fields.reorderPoint')}:</strong> {item.reorderPoint}</p>
                                <p><strong>{t('stock.fields.location')}:</strong> {item.location}</p>
                                <p><strong>{t('stock.fields.lastRestocked')}:</strong> {new Date(item.lastRestocked).toLocaleDateString()}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? t('stock.editItem') : t('stock.addItem')}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? t('stock.editItemDescription') : t('stock.addItemDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('stock.fields.name')}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">{t('stock.fields.quantity')}</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleTextChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('stock.fields.category')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange(value, 'category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('stock.filters.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">{t('stock.fields.supplier')}</Label>
                <Select
                  value={formData.supplier}
                  onValueChange={(value) => handleSelectChange(value, 'supplier')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('stock.fields.supplier')} />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">{t('stock.fields.unitPrice')}</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={handleTextChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderPoint">{t('stock.fields.reorderPoint')}</Label>
                <Input
                  id="reorderPoint"
                  name="reorderPoint"
                  type="number"
                  value={formData.reorderPoint}
                  onChange={handleTextChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('stock.fields.description')}</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t('stock.fields.location')}</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleTextChange}
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? t('common.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('stock.deleteItem')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('stock.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={loading}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 