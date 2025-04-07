import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
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

export function StockList() {
  const { t } = useTranslation();
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
      setItems(getApiResponse<StockItem[]>(response));
    } catch (error) {
      setError(handleApiError(error).message);
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
    if (quantity <= 0) return 'destructive';
    if (quantity <= reorderPoint) return 'warning';
    return 'success';
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
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('stock.title')}</h1>
        <Button onClick={handleClickOpen} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('stock.addNew')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('stock.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('stock.search')}</label>
              <Input
                name="search"
                value={filters.search}
                onChange={handleFilterTextChange}
                placeholder={t('stock.searchPlaceholder')}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('stock.category')}</label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterSelectChange(value, 'category')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('stock.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('stock.allCategories')}</SelectItem>
                  {/* Add your categories here */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('stock.sortBy')}</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterSelectChange(value, 'sortBy')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('stock.selectSortField')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t('stock.name')}</SelectItem>
                  <SelectItem value="quantity">{t('stock.quantity')}</SelectItem>
                  <SelectItem value="category">{t('stock.category')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                    {t('stock.name')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead>{t('stock.description')}</TableHead>
                  <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
                    {t('stock.quantity')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead>{t('stock.unitPrice')}</TableHead>
                  <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                    {t('stock.category')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead>{t('stock.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(item.quantity, item.reorderPoint)}>
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('stock.addNewItem')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('stock.name')}</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  placeholder={t('stock.namePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('stock.category')}</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange(value, 'category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('stock.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add your categories here */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('stock.description')}</label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                placeholder={t('stock.descriptionPlaceholder')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('stock.quantity')}</label>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleTextChange}
                  placeholder={t('stock.quantityPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('stock.unitPrice')}</label>
                <Input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleTextChange}
                  placeholder={t('stock.unitPricePlaceholder')}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {deleteConfirm && (
        <Dialog open={true} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('stock.confirmDelete')}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {t('stock.confirmDeleteDescription')}
            </DialogDescription>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => handleDelete(deleteConfirm)}>
                {t('common.confirm')}
              </Button>
              <Button variant="destructive" onClick={() => setDeleteConfirm(null)}>
                {t('common.cancel')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 