import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { Product, ProductInput, LocalizedString } from '@/types/product';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ProductForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductInput>({
    name: { en: '', fr: '', ar: '' },
    description: { en: '', fr: '', ar: '' },
    category: '',
    supplier: '',
    unit: '',
    purchasePrice: 0,
    sellingPrice: 0,
    tvaRate: 19,
    isActive: true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('en');

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const fetchedProduct = await productService.getProductById(id);
      setProduct({
        code: fetchedProduct.code,
        name: fetchedProduct.name,
        description: fetchedProduct.description || { en: '', fr: '', ar: '' },
        category: typeof fetchedProduct.category === 'object' ? fetchedProduct.category._id : fetchedProduct.category,
        supplier: typeof fetchedProduct.supplier === 'object' ? fetchedProduct.supplier._id : fetchedProduct.supplier,
        unit: fetchedProduct.unit,
        purchasePrice: fetchedProduct.purchasePrice,
        sellingPrice: fetchedProduct.sellingPrice,
        tvaRate: fetchedProduct.tvaRate,
        barcode: fetchedProduct.barcode,
        isActive: fetchedProduct.isActive,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('stock.products.error.fetch'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // This would be replaced with actual API call
      setCategories([
        { _id: 'category1', name: { en: 'Category 1', fr: 'Catégorie 1', ar: 'الفئة 1' } },
        { _id: 'category2', name: { en: 'Category 2', fr: 'Catégorie 2', ar: 'الفئة 2' } },
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      // This would be replaced with actual API call
      setSuppliers([
        { _id: 'supplier1', name: { en: 'Supplier 1', fr: 'Fournisseur 1', ar: 'المورد 1' } },
        { _id: 'supplier2', name: { en: 'Supplier 2', fr: 'Fournisseur 2', ar: 'المورد 2' } },
      ]);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocalizedInputChange = (
    field: 'name' | 'description',
    lang: 'en' | 'fr' | 'ar',
    value: string
  ) => {
    setProduct((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as LocalizedString),
        [lang]: value,
      },
    }));
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'purchasePrice' | 'sellingPrice'
  ) => {
    const value = parseFloat(e.target.value);
    setProduct((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProduct((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!product.name.en || !product.name.fr || !product.name.ar) {
      toast({
        title: t('common.error'),
        description: t('stock.products.error.nameRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (!product.category) {
      toast({
        title: t('common.error'),
        description: t('stock.products.error.categoryRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (!product.supplier) {
      toast({
        title: t('common.error'),
        description: t('stock.products.error.supplierRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (!product.unit) {
      toast({
        title: t('common.error'),
        description: t('stock.products.error.unitRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      if (isEditMode) {
        await productService.updateProduct(id, product);
        toast({
          title: t('common.success'),
          description: t('stock.products.success.updated'),
        });
      } else {
        await productService.createProduct(product);
        toast({
          title: t('common.success'),
          description: t('stock.products.success.created'),
        });
      }
      navigate('/stock/products');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: isEditMode
          ? t('stock.products.error.update')
          : t('stock.products.error.create'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getLocalizedName = (name: LocalizedString) => {
    const currentLanguage = i18n.language as keyof LocalizedString;
    return name[currentLanguage] || name.en || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
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
              <CardTitle>
                {isEditMode ? t('stock.products.edit') : t('stock.products.add')}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? t('stock.products.editDescription')
                  : t('stock.products.addDescription')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Code */}
              <div className="space-y-2">
                <Label htmlFor="code">{t('stock.products.code')}</Label>
                <Input
                  id="code"
                  name="code"
                  value={product.code || ''}
                  onChange={handleInputChange}
                  placeholder={t('stock.products.codeGenerated')}
                  disabled={isEditMode}
                />
              </div>

              {/* Barcode */}
              <div className="space-y-2">
                <Label htmlFor="barcode">{t('stock.products.barcode')}</Label>
                <Input
                  id="barcode"
                  name="barcode"
                  value={product.barcode || ''}
                  onChange={handleInputChange}
                  placeholder={t('stock.products.barcodePlaceholder')}
                />
              </div>
            </div>

            {/* Multilingual fields */}
            <div className="space-y-2">
              <Label>{t('stock.products.name')}</Label>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="fr">Français</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>
                <TabsContent value="en">
                  <Input
                    value={product.name.en}
                    onChange={(e) => handleLocalizedInputChange('name', 'en', e.target.value)}
                    placeholder="Product name in English"
                    required
                  />
                </TabsContent>
                <TabsContent value="fr">
                  <Input
                    value={product.name.fr}
                    onChange={(e) => handleLocalizedInputChange('name', 'fr', e.target.value)}
                    placeholder="Nom du produit en français"
                    required
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <Input
                    value={product.name.ar}
                    onChange={(e) => handleLocalizedInputChange('name', 'ar', e.target.value)}
                    placeholder="اسم المنتج بالعربية"
                    required
                    className="text-right"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>{t('stock.products.description')}</Label>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="fr">Français</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>
                <TabsContent value="en">
                  <Textarea
                    value={product.description?.en || ''}
                    onChange={(e) => handleLocalizedInputChange('description', 'en', e.target.value)}
                    placeholder="Product description in English"
                  />
                </TabsContent>
                <TabsContent value="fr">
                  <Textarea
                    value={product.description?.fr || ''}
                    onChange={(e) => handleLocalizedInputChange('description', 'fr', e.target.value)}
                    placeholder="Description du produit en français"
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <Textarea
                    value={product.description?.ar || ''}
                    onChange={(e) => handleLocalizedInputChange('description', 'ar', e.target.value)}
                    placeholder="وصف المنتج بالعربية"
                    className="text-right"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">{t('stock.products.category')}</Label>
                <Select
                  value={product.category}
                  onValueChange={(value) =>
                    setProduct((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('stock.products.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {getLocalizedName(category.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Supplier */}
              <div className="space-y-2">
                <Label htmlFor="supplier">{t('stock.products.supplier')}</Label>
                <Select
                  value={product.supplier}
                  onValueChange={(value) =>
                    setProduct((prev) => ({ ...prev, supplier: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('stock.products.selectSupplier')} />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {getLocalizedName(supplier.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Unit */}
              <div className="space-y-2">
                <Label htmlFor="unit">{t('stock.products.unit')}</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={product.unit}
                  onChange={handleInputChange}
                  placeholder={t('stock.products.unitPlaceholder')}
                  required
                />
              </div>

              {/* Purchase Price */}
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">{t('stock.products.purchasePrice')}</Label>
                <div className="relative">
                  <Input
                    id="purchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.purchasePrice}
                    onChange={(e) => handleNumberInputChange(e, 'purchasePrice')}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {t('common.currency')}
                  </div>
                </div>
              </div>

              {/* Selling Price */}
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">{t('stock.products.sellingPrice')}</Label>
                <div className="relative">
                  <Input
                    id="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.sellingPrice}
                    onChange={(e) => handleNumberInputChange(e, 'sellingPrice')}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {t('common.currency')}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TVA Rate */}
              <div className="space-y-2">
                <Label htmlFor="tvaRate">{t('stock.products.tvaRate')}</Label>
                <Select
                  value={product.tvaRate.toString()}
                  onValueChange={(value) =>
                    setProduct((prev) => ({ ...prev, tvaRate: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('stock.products.selectTvaRate')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="9">9%</SelectItem>
                    <SelectItem value="19">19%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Status */}
              <div className="space-y-2">
                <Label htmlFor="isActive">{t('stock.products.status')}</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={product.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {product.isActive
                      ? t('common.status.active')
                      : t('common.status.inactive')}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/stock/products')}
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

export default ProductForm;
