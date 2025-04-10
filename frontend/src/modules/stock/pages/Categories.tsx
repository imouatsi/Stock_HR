import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { useToast } from '../../../hooks/useToast';
import { stockService, type StockCategory } from '../../../services/stockService';

// Using StockCategory from stockService

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<StockCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StockCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categories = await stockService.getAllCategories();
      setCategories(categories);
      setError(null);
    } catch (err) {
      setError(t('common.error.loading'));
      showToast({
        title: t('common.error.title'),
        description: t('common.error.loading'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await stockService.updateCategory(editingCategory._id, formData);
        showToast({
          title: t('common.success'),
          description: t('stock.categories.updateSuccess')
        });
      } else {
        await stockService.createCategory(formData);
        showToast({
          title: t('common.success'),
          description: t('stock.categories.createSuccess')
        });
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      showToast({
        title: t('common.error.title'),
        description: t('common.error.save'),
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('stock.categories.confirmDelete'))) return;

    try {
      await stockService.deleteCategory(id);
      showToast({
        title: t('common.success'),
        description: t('stock.categories.deleteSuccess')
      });
      fetchCategories();
    } catch (err) {
      showToast({
        title: t('common.error.title'),
        description: t('common.error.delete'),
        variant: 'destructive'
      });
    }
  };

  const filteredCategories = categories && categories.length > 0 ? categories.filter(category =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category?.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('stock.categories.title')}</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          {t('stock.categories.add')}
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder={t('stock.categories.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('stock.categories.name')}</TableHead>
                <TableHead>{t('stock.categories.description')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories?.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category);
                          setFormData({
                            name: category.name,
                            description: category.description || ''
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        {t('common.edit')}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category._id)}
                      >
                        {t('common.delete')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? t('stock.categories.edit') : t('stock.categories.add')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('stock.categories.name')}
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('stock.categories.description')}
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {editingCategory ? t('common.save') : t('common.add')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;