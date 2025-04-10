import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BalanceSheet } from '@/types/financial-statements';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BalanceSheetViewProps {
  data: BalanceSheet;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const BalanceSheetView: React.FC<BalanceSheetViewProps> = ({ 
  data, 
  formatCurrency, 
  formatDate 
}) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('accounting.financialStatements.balanceSheet')}</CardTitle>
        <CardDescription>
          {t('accounting.financialStatements.asOf')} {formatDate(data.date)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Assets */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.assets')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousTotalAssets !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Non-Current Assets */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>{data.assets.nonCurrentAssets.code}</TableCell>
                  <TableCell>{data.assets.nonCurrentAssets.label}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.assets.nonCurrentAssets.total)}
                  </TableCell>
                  {data.previousTotalAssets !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.assets.nonCurrentAssets.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>

                {/* Non-Current Asset Items */}
                {data.assets.nonCurrentAssets.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousTotalAssets !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Current Assets */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>{data.assets.currentAssets.code}</TableCell>
                  <TableCell>{data.assets.currentAssets.label}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.assets.currentAssets.total)}
                  </TableCell>
                  {data.previousTotalAssets !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.assets.currentAssets.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>

                {/* Current Asset Items */}
                {data.assets.currentAssets.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousTotalAssets !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Assets */}
                <TableRow className="font-bold bg-muted">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.totalAssets')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.totalAssets)}
                  </TableCell>
                  {data.previousTotalAssets !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousTotalAssets)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Liabilities and Equity */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.liabilitiesAndEquity')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousTotalLiabilities !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Equity */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>{data.liabilities.equity.code}</TableCell>
                  <TableCell>{data.liabilities.equity.label}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.liabilities.equity.total)}
                  </TableCell>
                  {data.previousTotalLiabilities !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.liabilities.equity.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>

                {/* Equity Items */}
                {data.liabilities.equity.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousTotalLiabilities !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Non-Current Liabilities */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>{data.liabilities.nonCurrentLiabilities.code}</TableCell>
                  <TableCell>{data.liabilities.nonCurrentLiabilities.label}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.liabilities.nonCurrentLiabilities.total)}
                  </TableCell>
                  {data.previousTotalLiabilities !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.liabilities.nonCurrentLiabilities.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>

                {/* Non-Current Liability Items */}
                {data.liabilities.nonCurrentLiabilities.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousTotalLiabilities !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Current Liabilities */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>{data.liabilities.currentLiabilities.code}</TableCell>
                  <TableCell>{data.liabilities.currentLiabilities.label}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.liabilities.currentLiabilities.total)}
                  </TableCell>
                  {data.previousTotalLiabilities !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.liabilities.currentLiabilities.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>

                {/* Current Liability Items */}
                {data.liabilities.currentLiabilities.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousTotalLiabilities !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Liabilities and Equity */}
                <TableRow className="font-bold bg-muted">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.totalLiabilitiesAndEquity')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.totalLiabilities)}
                  </TableCell>
                  {data.previousTotalLiabilities !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousTotalLiabilities)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceSheetView;
