import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  category: string;
  balance: number;
}

const ChartOfAccounts: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAccount = () => {
    // TODO: Implement add account functionality
    toast({
      title: t('common.notImplemented'),
      description: t('common.featureComingSoon'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('accounting.chartOfAccounts.title')}</h1>
        <Button onClick={handleAddAccount}>
          {t('accounting.chartOfAccounts.addAccount')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('accounting.chartOfAccounts.code')}</TableHead>
              <TableHead>{t('accounting.chartOfAccounts.name')}</TableHead>
              <TableHead>{t('accounting.chartOfAccounts.type')}</TableHead>
              <TableHead>{t('accounting.chartOfAccounts.category')}</TableHead>
              <TableHead className="text-right">{t('accounting.chartOfAccounts.balance')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.code}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell>{account.category}</TableCell>
                  <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast({
                          title: t('common.notImplemented'),
                          description: t('common.featureComingSoon'),
                        });
                      }}
                    >
                      {t('common.edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChartOfAccounts; 