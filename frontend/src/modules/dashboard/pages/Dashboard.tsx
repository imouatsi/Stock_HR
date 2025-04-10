import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { BarChart, DollarSign, Users, Package } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { dashboardService, DashboardData } from '../../../services/dashboardService';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Dashboard component: Fetching data...');
        const dashboardData = await dashboardService.getDashboardData();
        console.log('Dashboard component: Data received:', dashboardData);
        setData(dashboardData);
        // Clear any previous errors
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(t('dashboard.error.loading'));
        // Don't set data to null, keep any previous data
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [t]);

  const renderCardContent = (value: number | string | undefined, subtitle: string, isRevenue: boolean = false) => {
    if (loading) {
      return (
        <>
          <Skeleton className="h-8 w-[100px] mb-2" />
          <Skeleton className="h-4 w-[80px]" />
        </>
      );
    }

    if (error || !value) {
      return <div className="text-sm text-red-500">{error || t('common.error.loading')}</div>;
    }

    return (
      <>
        <div className="text-2xl font-bold">
          {typeof value === 'number' && value.toLocaleString('fr-DZ', {
            style: isRevenue ? 'currency' : 'decimal',
            currency: 'DZD',
            minimumFractionDigits: isRevenue ? 2 : 0
          })}
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('common.dashboard')}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('accounting.dashboard.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderCardContent(data?.totalRevenue, t('accounting.dashboard.revenueChange'), true)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('accounting.dashboard.openContracts')}</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderCardContent(data?.activeContracts, t('accounting.dashboard.contractsChange'))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('hr.dashboard.totalEmployees')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderCardContent(data?.totalUsers, t('hr.dashboard.employeesChange'))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stock.dashboard.totalItems')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderCardContent(data?.inventoryItems, t('stock.dashboard.itemsChange'))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;