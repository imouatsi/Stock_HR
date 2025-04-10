import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { warehouseService } from '@/services/warehouseService';
import { Warehouse, WarehouseInput, LocalizedString } from '@/types/warehouse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const WarehouseForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [warehouse, setWarehouse] = useState<WarehouseInput>({
    name: { en: '', fr: '', ar: '' },
    address: '',
    manager: '',
    isActive: true,
  });
  const [managers, setManagers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('en');

  // Check if user has permission to edit warehouses
  const canEdit = ['admin', 'superadmin', 'stock_manager'].includes(user?.role || '');

  useEffect(() => {
    fetchManagers();
    if (isEditMode) {
      fetchWarehouse();
    }
  }, [id]);

  const fetchWarehouse = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const fetchedWarehouse = await warehouseService.getWarehouseById(id);
      setWarehouse({
        code: fetchedWarehouse.code,
        name: fetchedWarehouse.name,
        address: fetchedWarehouse.address,
        manager: typeof fetchedWarehouse.manager === 'object' ? fetchedWarehouse.manager._id : fetchedWarehouse.manager,
        isActive: fetchedWarehouse.isActive,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('stock.warehouses.error.fetch'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      // This would be replaced with actual API call to get users with manager role
      setManagers([
        { _id: 'manager1', name: 'Manager 1', email: 'manager1@example.com' },
        { _id: 'manager2', name: 'Manager 2', email: 'manager2@example.com' },
      ]);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWarehouse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocalizedInputChange = (
    field: 'name',
    lang: 'en' | 'fr' | 'ar',
    value: string
  ) => {
    setWarehouse((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as LocalizedString),
        [lang]: value,
      },
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setWarehouse((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!warehouse.name.en || !warehouse.name.fr || !warehouse.name.ar) {
      toast({
        title: t('common.error'),
        description: t('stock.warehouses.error.nameRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (!warehouse.address) {
      toast({
        title: t('common.error'),
        description: t('stock.warehouses.error.addressRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (!warehouse.manager) {
      toast({
        title: t('common.error'),
        description: t('stock.warehouses.error.managerRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      if (isEditMode) {
        await warehouseService.updateWarehouse(id, warehouse);
        toast({
          title: t('common.success'),
          description: t('stock.warehouses.success.updated'),
        });
      } else {
        await warehouseService.createWarehouse(warehouse);
        toast({
          title: t('common.success'),
          description: t('stock.warehouses.success.created'),
        });
      }
      navigate('/stock/warehouses');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: isEditMode
          ? t('stock.warehouses.error.update')
          : t('stock.warehouses.error.create'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect if user doesn't have permission
  if (!canEdit) {
    navigate('/stock/warehouses');
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/stock/warehouses')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>
                {isEditMode ? t('stock.warehouses.edit') : t('stock.warehouses.add')}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? t('stock.warehouses.editDescription')
                  : t('stock.warehouses.addDescription')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">{t('stock.warehouses.code')}</Label>
              <Input
                id="code"
                name="code"
                value={warehouse.code || ''}
                onChange={handleInputChange}
                placeholder={t('stock.warehouses.codeGenerated')}
                disabled={isEditMode}
              />
            </div>

            {/* Multilingual Name */}
            <div className="space-y-2">
              <Label>{t('stock.warehouses.name')}</Label>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="fr">Français</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>
                <TabsContent value="en">
                  <Input
                    value={warehouse.name.en}
                    onChange={(e) => handleLocalizedInputChange('name', 'en', e.target.value)}
                    placeholder="Warehouse name in English"
                    required
                  />
                </TabsContent>
                <TabsContent value="fr">
                  <Input
                    value={warehouse.name.fr}
                    onChange={(e) => handleLocalizedInputChange('name', 'fr', e.target.value)}
                    placeholder="Nom de l'entrepôt en français"
                    required
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <Input
                    value={warehouse.name.ar}
                    onChange={(e) => handleLocalizedInputChange('name', 'ar', e.target.value)}
                    placeholder="اسم المستودع بالعربية"
                    required
                    className="text-right"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">{t('stock.warehouses.address')}</Label>
              <Input
                id="address"
                name="address"
                value={warehouse.address}
                onChange={handleInputChange}
                placeholder={t('stock.warehouses.addressPlaceholder')}
                required
              />
            </div>

            {/* Manager */}
            <div className="space-y-2">
              <Label htmlFor="manager">{t('stock.warehouses.manager')}</Label>
              <Select
                value={warehouse.manager}
                onValueChange={(value) =>
                  setWarehouse((prev) => ({ ...prev, manager: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('stock.warehouses.selectManager')} />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem key={manager._id} value={manager._id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label htmlFor="isActive">{t('stock.warehouses.status')}</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={warehouse.isActive}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {warehouse.isActive
                    ? t('common.status.active')
                    : t('common.status.inactive')}
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/stock/warehouses')}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {t('common.save')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
