import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
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

export const ProductDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const currentLanguage = i18n.language;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  const canEdit = ['admin', 'superadmin', 'stock_manager'].includes(user?.role || '');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const fetchedProduct = await productService.getProductById(id!);
      setProduct(fetchedProduct);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('stock.products.error.fetch'),
        variant: 'destructive',
      });
      navigate('/stock/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    if (window.confirm(t('stock.products.confirmDelete'))) {
      try {
        await productService.deleteProduct(product._id);
        toast({
          title: t('common.success'),
          description: t('stock.products.success.deleted'),
        });
        navigate('/stock/products');
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('stock.products.error.delete'),
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p>{t('stock.products.notFound')}</p>
              <Button
                variant="outline"
                onClick={() => navigate('/stock/products')}
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
                onClick={() => navigate('/stock/products')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>{getLocalizedValue(product.name)}</CardTitle>
                <CardDescription>{product.code}</CardDescription>
              </div>
            </div>
            {canEdit && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/stock/products/${product._id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t('common.edit')}
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('common.delete')}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">{t('stock.products.details')}</TabsTrigger>
              <TabsTrigger value="stock">{t('stock.products.stock')}</TabsTrigger>
              <TabsTrigger value="history">{t('stock.products.history')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.code')}
                    </h3>
                    <p>{product.code}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.barcode')}
                    </h3>
                    <p>{product.barcode || t('common.notSpecified')}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.category')}
                    </h3>
                    <p>
                      {typeof product.category === 'object'
                        ? getLocalizedValue(product.category.name)
                        : product.category}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.supplier')}
                    </h3>
                    <p>
                      {typeof product.supplier === 'object'
                        ? getLocalizedValue(product.supplier.name)
                        : product.supplier}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.unit')}
                    </h3>
                    <p>{product.unit}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.purchasePrice')}
                    </h3>
                    <p>
                      {product.purchasePrice.toLocaleString()} {t('common.currency')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.sellingPrice')}
                    </h3>
                    <p>
                      {product.sellingPrice.toLocaleString()} {t('common.currency')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.tvaRate')}
                    </h3>
                    <p>{product.tvaRate}%</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('stock.products.status')}
                    </h3>
                    <Badge variant={product.isActive ? 'success' : 'destructive'}>
                      {product.isActive
                        ? t('common.status.active')
                        : t('common.status.inactive')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t('stock.products.description')}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  {product.description ? (
                    <p>{getLocalizedValue(product.description)}</p>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500">
                      {t('common.noDescription')}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('common.createdInfo')}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <p>
                      {t('common.by')}: {product.createdBy}
                    </p>
                    <p>
                      {t('common.at')}: {new Date(product.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('common.updatedInfo')}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <p>
                      {t('common.by')}: {product.updatedBy}
                    </p>
                    <p>
                      {t('common.at')}: {new Date(product.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stock">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-md text-center">
                <p>{t('stock.products.stockTabComingSoon')}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-md text-center">
                <p>{t('stock.products.historyTabComingSoon')}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => navigate('/stock/products')}
          >
            {t('common.backToList')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
