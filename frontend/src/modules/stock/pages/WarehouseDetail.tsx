import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { warehouseService } from '@/services/warehouseService';
import { Warehouse } from '@/types/warehouse';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const WarehouseDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const currentLanguage = i18n.language;

  const [loading, setLoading] = useState(true);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  // Admin, Superadmin, and Stock Manager can edit warehouses
  const canEdit = ['admin', 'superadmin', 'stock_manager'].includes(user?.role || '');
  // Only Admin and Superadmin can delete warehouses
  const canDelete = ['admin', 'superadmin'].includes(user?.role || '');

  useEffect(() => {
    if (id) {
      fetchWarehouse();
    }
  }, [id]);

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      const fetchedWarehouse = await warehouseService.getWarehouseById(id!);
      setWarehouse(fetchedWarehouse);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('stock.warehouses.error.fetch'),
        variant: 'destructive',
      });
      navigate('/stock/warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!warehouse) return;
    
    if (window.confirm(t('stock.warehouses.confirmDelete'))) {
      try {
        await warehouseService.deleteWarehouse(warehouse._id);
        toast({
          title: t('common.success'),
          description: t('stock.warehouses.success.deleted'),
        });
        navigate('/stock/warehouses');
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('stock.warehouses.error.delete'),
          variant: 'destructive',
        });
      }
    }
  };

  const getLocalizedValue = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[currentLanguage] || value.en || '';
  };

  const getManagerName = (manager: any) => {
    if (!manager) return '';
    if (typeof manager === 'string') return manager;
    return manager.name || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p>{t('stock.warehouses.notFound')}</p>
              <Button
                variant="outline"
                onClick={() => navigate('/stock/warehouses')}
                className="mt-4"
              >
                {t('common.backToList')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
                <CardTitle>{getLocalizedValue(warehouse.name)}</CardTitle>
                <CardDescription>{warehouse.code}</CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              {canEdit && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/stock/warehouses/${warehouse._id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t('common.edit')}
                </Button>
              )}
              {canDelete && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('common.delete')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">{t('stock.warehouses.details')}</TabsTrigger>
              <TabsTrigger value="inventory">{t('stock.warehouses.inventory')}</TabsTrigger>
              <TabsTrigger value="movements">{t('stock.warehouses.movements')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.warehouses.code')}
                    </h3>
                    <p>{warehouse.code}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.warehouses.name')}
                    </h3>
                    <div className="space-y-1">
                      <p>🇬🇧 {warehouse.name.en}</p>
                      <p>🇫🇷 {warehouse.name.fr}</p>
                      <p>🇩🇿 {warehouse.name.ar}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.warehouses.address')}
                    </h3>
                    <p>{warehouse.address}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.warehouses.manager')}
                    </h3>
                    <p>{getManagerName(warehouse.manager)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.warehouses.status')}
                    </h3>
                    <Badge variant={warehouse.isActive ? 'success' : 'destructive'}>
                      {warehouse.isActive
                        ? t('common.status.active')
                        : t('common.status.inactive')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('common.createdInfo')}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <p>
                      {t('common.by')}: {warehouse.createdBy}
                    </p>
                    <p>
                      {t('common.at')}: {new Date(warehouse.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('common.updatedInfo')}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <p>
                      {t('common.by')}: {warehouse.updatedBy}
                    </p>
                    <p>
                      {t('common.at')}: {new Date(warehouse.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-md text-center">
                <p>{t('stock.warehouses.inventoryTabComingSoon')}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="movements">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-md text-center">
                <p>{t('stock.warehouses.movementsTabComingSoon')}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => navigate('/stock/warehouses')}
          >
            {t('common.backToList')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
