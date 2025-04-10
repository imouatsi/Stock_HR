import React, { useState, useEffect } from 'react';
import { accountingService } from '@/services/accountingService';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { SCFAccount, AccountingPeriod, GeneralLedgerAccount } from '@/types/accounting';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const GeneralLedger: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SCFAccount[]>([]);
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [ledgerAccounts, setLedgerAccounts] = useState<GeneralLedgerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLedger, setIsLoadingLedger] = useState(false);
  const [filters, setFilters] = useState({
    accountId: '',
    periodId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch accounts and periods in parallel
      const [accountsData, periodsData] = await Promise.all([
        accountingService.getAllChartOfAccounts(),
        accountingService.getAllAccountingPeriods()
      ]);
      
      setAccounts(accountsData);
      setPeriods(periodsData);
      
      // Set default period to current month
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentPeriodId = `P-${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      const currentPeriod = periodsData.find(p => p._id === currentPeriodId);
      
      if (currentPeriod) {
        setFilters(prev => ({
          ...prev,
          periodId: currentPeriodId,
          startDate: currentPeriod.startDate,
          endDate: currentPeriod.endDate
        }));
        
        // Fetch ledger for current period
        fetchLedger({
          periodId: currentPeriodId,
          startDate: currentPeriod.startDate,
          endDate: currentPeriod.endDate
        });
      } else {
        // If no current period, fetch all ledger entries
        fetchLedger({});
      }
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('common.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLedger = async (params = filters) => {
    try {
      setIsLoadingLedger(true);
      const data = await accountingService.getGeneralLedger(params);
      setLedgerAccounts(data);
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.generalLedger.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingLedger(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-DZ');
  };

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    let newFilters = { ...filters, [name]: value };
    
    // If period changes, update date range
    if (name === 'periodId' && value) {
      const period = periods.find(p => p._id === value);
      if (period) {
        newFilters.startDate = period.startDate;
        newFilters.endDate = period.endDate;
      }
    }
    
    // If date range changes, clear period
    if ((name === 'startDate' || name === 'endDate') && value) {
      newFilters.periodId = '';
    }
    
    setFilters(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    fetchLedger(filters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      accountId: '',
      periodId: '',
      startDate: '',
      endDate: ''
    });
    fetchLedger({});
  };

  // Get account type badge color
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset':
        return 'bg-blue-100 text-blue-800';
      case 'liability':
        return 'bg-red-100 text-red-800';
      case 'equity':
        return 'bg-green-100 text-green-800';
      case 'income':
        return 'bg-purple-100 text-purple-800';
      case 'expense':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('accounting.generalLedger.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('accounting.generalLedger.description')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-md border p-4 space-y-4">
        <h2 className="text-lg font-medium">{t('accounting.generalLedger.filters')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Account Filter */}
          <div className="space-y-2">
            <Label htmlFor="accountId">{t('accounting.generalLedger.account')}</Label>
            <Select
              value={filters.accountId}
              onValueChange={(value) => handleFilterChange('accountId', value)}
            >
              <SelectTrigger id="accountId">
                <SelectValue placeholder={t('accounting.generalLedger.allAccounts')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('accounting.generalLedger.allAccounts')}</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account._id} value={account._id || ''}>
                    {account.code} - {account.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Period Filter */}
          <div className="space-y-2">
            <Label htmlFor="periodId">{t('accounting.generalLedger.period')}</Label>
            <Select
              value={filters.periodId}
              onValueChange={(value) => handleFilterChange('periodId', value)}
            >
              <SelectTrigger id="periodId">
                <SelectValue placeholder={t('accounting.generalLedger.selectPeriod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('accounting.generalLedger.customPeriod')}</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period._id} value={period._id || ''}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Filters */}
          <div className="space-y-2">
            <Label htmlFor="startDate">{t('accounting.generalLedger.startDate')}</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">{t('accounting.generalLedger.endDate')}</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={resetFilters}>
            {t('common.reset')}
          </Button>
          <Button onClick={applyFilters}>
            {t('accounting.generalLedger.applyFilters')}
          </Button>
        </div>
      </div>

      {/* Ledger */}
      {isLoading || isLoadingLedger ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {ledgerAccounts.length === 0 ? (
            <div className="rounded-md border p-8 text-center">
              <p className="text-lg text-muted-foreground">{t('accounting.generalLedger.noEntries')}</p>
            </div>
          ) : (
            ledgerAccounts.map((ledgerAccount) => (
              <div key={ledgerAccount.accountId} className="rounded-md border">
                <div className="bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {ledgerAccount.accountCode} - {ledgerAccount.accountLabel}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getAccountTypeColor(ledgerAccount.accountType)}>
                          {t(`accounting.chartOfAccounts.types.${ledgerAccount.accountType}`)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="font-medium">{t('accounting.generalLedger.openingBalance')}:</span> {formatCurrency(ledgerAccount.openingBalance)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{t('accounting.generalLedger.closingBalance')}:</span> {formatCurrency(ledgerAccount.closingBalance)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('accounting.generalLedger.date')}</TableHead>
                        <TableHead>{t('accounting.generalLedger.reference')}</TableHead>
                        <TableHead>{t('accounting.generalLedger.description')}</TableHead>
                        <TableHead className="text-right">{t('accounting.generalLedger.debit')}</TableHead>
                        <TableHead className="text-right">{t('accounting.generalLedger.credit')}</TableHead>
                        <TableHead className="text-right">{t('accounting.generalLedger.balance')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerAccount.entries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            {t('accounting.generalLedger.noEntries')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        ledgerAccount.entries.map((entry) => (
                          <TableRow key={entry._id}>
                            <TableCell>{formatDate(entry.date)}</TableCell>
                            <TableCell>{entry.journalReference}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell className="text-right font-mono">
                              {entry.debit > 0 ? formatCurrency(entry.debit) : ''}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {entry.credit > 0 ? formatCurrency(entry.credit) : ''}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(entry.balance)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
                
                <div className="bg-muted p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-right">
                      <span className="font-medium">{t('accounting.generalLedger.totalDebit')}:</span> {formatCurrency(ledgerAccount.totalDebit)}
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{t('accounting.generalLedger.totalCredit')}:</span> {formatCurrency(ledgerAccount.totalCredit)}
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{t('accounting.generalLedger.netChange')}:</span> {formatCurrency(ledgerAccount.totalDebit - ledgerAccount.totalCredit)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GeneralLedger;
