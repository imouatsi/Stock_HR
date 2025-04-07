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

interface FinancialStatement {
  id: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow';
  period: string;
  date: string;
  status: 'draft' | 'final' | 'approved';
}

const FinancialStatements: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [statements, setStatements] = useState<FinancialStatement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStatement = () => {
    // TODO: Implement generate statement functionality
    toast({
      title: t('common.notImplemented'),
      description: t('common.featureComingSoon'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('accounting.financialStatements.title')}</h1>
        <Button onClick={handleGenerateStatement}>
          {t('accounting.financialStatements.generate')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('accounting.financialStatements.type')}</TableHead>
              <TableHead>{t('accounting.financialStatements.period')}</TableHead>
              <TableHead>{t('accounting.financialStatements.date')}</TableHead>
              <TableHead>{t('accounting.financialStatements.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              statements.map((statement) => (
                <TableRow key={statement.id}>
                  <TableCell>{t(`accounting.financialStatements.types.${statement.type}`)}</TableCell>
                  <TableCell>{statement.period}</TableCell>
                  <TableCell>{statement.date}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statement.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : statement.status === 'final'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {t(`accounting.financialStatements.status.${statement.status}`)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement view functionality
                        toast({
                          title: t('common.notImplemented'),
                          description: t('common.featureComingSoon'),
                        });
                      }}
                    >
                      {t('common.view')}
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

export default FinancialStatements; 