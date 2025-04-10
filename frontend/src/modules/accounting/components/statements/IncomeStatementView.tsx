import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IncomeStatement } from '@/types/financial-statements';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface IncomeStatementViewProps {
  data: IncomeStatement;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const IncomeStatementView: React.FC<IncomeStatementViewProps> = ({ 
  data, 
  formatCurrency, 
  formatDate 
}) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('accounting.financialStatements.incomeStatement')}</CardTitle>
        <CardDescription>
          {t('accounting.financialStatements.period')}: {formatDate(data.startDate)} - {formatDate(data.endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Operating Revenue */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.operatingRevenue')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousOperatingResult !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Operating Revenue Items */}
                {data.operatingRevenue.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousOperatingResult !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Operating Revenue */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.totalOperatingRevenue')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.operatingRevenue.total)}
                  </TableCell>
                  {data.previousOperatingResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.operatingRevenue.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Operating Expenses */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.operatingExpenses')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousOperatingResult !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Operating Expense Items */}
                {data.operatingExpenses.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousOperatingResult !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Operating Expenses */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.totalOperatingExpenses')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.operatingExpenses.total)}
                  </TableCell>
                  {data.previousOperatingResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.operatingExpenses.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Operating Result */}
          <div>
            <Table>
              <TableBody>
                <TableRow className="font-bold bg-muted">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.operatingResult')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.operatingResult)}
                  </TableCell>
                  {data.previousOperatingResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousOperatingResult)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Financial Revenue */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.financialRevenue')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousFinancialResult !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Financial Revenue Items */}
                {data.financialRevenue.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousFinancialResult !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Financial Revenue */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.totalFinancialRevenue')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.financialRevenue.total)}
                  </TableCell>
                  {data.previousFinancialResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.financialRevenue.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Financial Expenses */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.financialExpenses')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousFinancialResult !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Financial Expense Items */}
                {data.financialExpenses.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousFinancialResult !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Financial Expenses */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.totalFinancialExpenses')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.financialExpenses.total)}
                  </TableCell>
                  {data.previousFinancialResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.financialExpenses.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Financial Result */}
          <div>
            <Table>
              <TableBody>
                <TableRow className="font-bold bg-muted">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.financialResult')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.financialResult)}
                  </TableCell>
                  {data.previousFinancialResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousFinancialResult)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Ordinary Result */}
          <div>
            <Table>
              <TableBody>
                <TableRow className="font-bold bg-muted">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.ordinaryResult')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.ordinaryResult)}
                  </TableCell>
                  {data.previousOrdinaryResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousOrdinaryResult)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Extraordinary Items (if any) */}
          {data.extraordinaryItems.items.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.extraordinaryItems')}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                    <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                    <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                    {data.previousExtraordinaryResult !== undefined && (
                      <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Extraordinary Items */}
                  {data.extraordinaryItems.items.map((item) => (
                    <TableRow key={item.code}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.label}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                      {data.previousExtraordinaryResult !== undefined && (
                        <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                      )}
                    </TableRow>
                  ))}

                  {/* Total Extraordinary Items */}
                  <TableRow className="font-medium bg-muted/50">
                    <TableCell></TableCell>
                    <TableCell>{t('accounting.financialStatements.totalExtraordinaryItems')}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.extraordinaryItems.total)}
                    </TableCell>
                    {data.previousExtraordinaryResult !== undefined && (
                      <TableCell className="text-right font-mono">
                        {formatCurrency(data.extraordinaryItems.previousTotal || 0)}
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Taxes */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.taxes')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousNetResult !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Tax Items */}
                {data.taxes.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousNetResult !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Taxes */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.totalTaxes')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.taxes.total)}
                  </TableCell>
                  {data.previousNetResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.taxes.previousTotal || 0)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Net Result */}
          <div>
            <Table>
              <TableBody>
                <TableRow className="font-bold bg-muted">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.netResult')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.netResult)}
                  </TableCell>
                  {data.previousNetResult !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousNetResult)}
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

export default IncomeStatementView;
