import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { Product, ProductFilters } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PlusCircle, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentLanguage = i18n.language;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const canEdit = ['admin', 'superadmin', 'stock_manager'].includes(user?.role || '');

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { products: fetchedProducts, pagination } = await productService.getAllProducts(filters);
      setProducts(fetchedProducts);
      setTotalPages(pagination.totalPages);
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

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchQuery,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters({
      ...filters,
      sortBy,
      sortOrder: filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('stock.products.confirmDelete'))) {
      try {
        await productService.deleteProduct(id);
        toast({
          title: t('common.success'),
          description: t('stock.products.success.deleted'),
        });
        fetchProducts();
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('stock.products.error.delete'),
          variant: 'destructive',
        });
      }
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const currentPage = filters.page || 1;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
              disabled={(filters.page || 1) <= 1}
            />
          </PaginationItem>
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && <PaginationEllipsis />}
            </>
          )}
          {pages}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
              disabled={(filters.page || 1) >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const getLocalizedName = (name: any) => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[currentLanguage] || name.en || '';
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('stock.products.title')}</CardTitle>
            <CardDescription>{t('stock.products.description')}</CardDescription>
          </div>
          {canEdit && (
            <Button onClick={() => navigate('/stock/products/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('stock.products.add')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder={t('stock.products.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange('code')}
                  >
                    {t('stock.products.code')}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange('name')}
                  >
                    {t('stock.products.name')}
                  </TableHead>
                  <TableHead>{t('stock.products.category')}</TableHead>
                  <TableHead>{t('stock.products.supplier')}</TableHead>
                  <TableHead className="text-right">{t('stock.products.purchasePrice')}</TableHead>
                  <TableHead className="text-right">{t('stock.products.sellingPrice')}</TableHead>
                  <TableHead className="text-center">{t('stock.products.tvaRate')}</TableHead>
                  <TableHead className="text-center">{t('stock.products.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 9 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{getLocalizedName(product.name)}</TableCell>
                      <TableCell>
                        {typeof product.category === 'object'
                          ? getLocalizedName(product.category.name)
                          : product.category}
                      </TableCell>
                      <TableCell>
                        {typeof product.supplier === 'object'
                          ? getLocalizedName(product.supplier.name)
                          : product.supplier}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.purchasePrice.toLocaleString()} {t('common.currency')}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.sellingPrice.toLocaleString()} {t('common.currency')}
                      </TableCell>
                      <TableCell className="text-center">{product.tvaRate}%</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={product.isActive ? 'success' : 'destructive'}>
                          {product.isActive
                            ? t('common.status.active')
                            : t('common.status.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/stock/products/${product._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canEdit && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/stock/products/${product._id}/edit`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center">{renderPagination()}</div>
        </CardContent>
      </Card>
    </div>
  );
};
