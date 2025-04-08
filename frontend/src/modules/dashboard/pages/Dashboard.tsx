import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { BarChart, DollarSign, Users, Package } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface DashboardData {
  totalRevenue: number;
  activeContracts: number;
  totalUsers: number;
  inventoryItems: number;
}

const MOCK_DATA: DashboardData = {
  totalRevenue: 45231.89,
  activeContracts: 24,
  totalUsers: 573,
  inventoryItems: 1432
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const data = MOCK_DATA;

  const renderCardContent = (value: number | string, subtitle: string) => {
    return (
      <>
        <div className="text-2xl font-bold">
          {typeof value === 'number' && value.toLocaleString('en-US', {
            style: value === data.totalRevenue ? 'currency' : 'decimal',
            currency: 'USD',
            minimumFractionDigits: value === data.totalRevenue ? 2 : 0
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
            {renderCardContent(data.totalRevenue, t('accounting.dashboard.revenueChange'))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('accounting.dashboard.openContracts')}</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderCardContent(data.activeContracts, t('accounting.dashboard.contractsChange'))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('hr.dashboard.totalEmployees')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderCardContent(data.totalUsers, t('hr.dashboard.employeesChange'))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stock.dashboard.totalItems')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderCardContent(data.inventoryItems, t('stock.dashboard.itemsChange'))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 