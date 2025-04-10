import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { warehouseService } from '@/services/warehouseService';
import { Warehouse, WarehouseFilters } from '@/types/warehouse';
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

export const Warehouses: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentLanguage = i18n.language;

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WarehouseFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Only Admin and Superadmin can create/delete warehouses
  const canCreate = ['admin', 'superadmin'].includes(user?.role || '');
  // Admin, Superadmin, and Stock Manager can edit warehouses
  const canEdit = ['admin', 'superadmin', 'stock_manager'].includes(user?.role || '');
  // Only Admin and Superadmin can delete warehouses
  const canDelete = ['admin', 'superadmin'].includes(user?.role || '');

  useEffect(() => {
    fetchWarehouses();
  }, [filters]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const { warehouses: fetchedWarehouses, pagination } = await warehouseService.getAllWarehouses(filters);
      setWarehouses(fetchedWarehouses);
      setTotalPages(pagination.totalPages);
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
    if (window.confirm(t('stock.warehouses.confirmDelete'))) {
      try {
        await warehouseService.deleteWarehouse(id);
        toast({
          title: t('common.success'),
          description: t('stock.warehouses.success.deleted'),
        });
        fetchWarehouses();
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('stock.warehouses.error.delete'),
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

  const getManagerName = (manager: any) => {
    if (!manager) return '';
    if (typeof manager === 'string') return manager;
    return manager.name || '';
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('stock.warehouses.title')}</CardTitle>
            <CardDescription>{t('stock.warehouses.description')}</CardDescription>
          </div>
          {canCreate && (
            <Button onClick={() => navigate('/stock/warehouses/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('stock.warehouses.add')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder={t('stock.warehouses.search')}
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
                    {t('stock.warehouses.code')}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange('name')}
                  >
                    {t('stock.warehouses.name')}
                  </TableHead>
                  <TableHead>{t('stock.warehouses.address')}</TableHead>
                  <TableHead>{t('stock.warehouses.manager')}</TableHead>
                  <TableHead className="text-center">{t('stock.warehouses.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 6 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : warehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  warehouses.map((warehouse) => (
                    <TableRow key={warehouse._id}>
                      <TableCell>{warehouse.code}</TableCell>
                      <TableCell>{getLocalizedName(warehouse.name)}</TableCell>
                      <TableCell>{warehouse.address}</TableCell>
                      <TableCell>{getManagerName(warehouse.manager)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={warehouse.isActive ? 'success' : 'destructive'}>
                          {warehouse.isActive
                            ? t('common.status.active')
                            : t('common.status.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/stock/warehouses/${warehouse._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/stock/warehouses/${warehouse._id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(warehouse._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
