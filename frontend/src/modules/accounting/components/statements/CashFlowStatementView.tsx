import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CashFlowStatement } from '@/types/financial-statements';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CashFlowStatementViewProps {
  data: CashFlowStatement;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const CashFlowStatementView: React.FC<CashFlowStatementViewProps> = ({ 
  data, 
  formatCurrency, 
  formatDate 
}) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('accounting.financialStatements.cashFlowStatement')}</CardTitle>
        <CardDescription>
          {t('accounting.financialStatements.period')}: {formatDate(data.startDate)} - {formatDate(data.endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Operating Activities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.operatingActivities')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousNetCashFromOperatingActivities !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Operating Activities Items */}
                {data.operatingActivities.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousNetCashFromOperatingActivities !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Operating Activities */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.netCashFromOperatingActivities')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.netCashFromOperatingActivities)}
                  </TableCell>
                  {data.previousNetCashFromOperatingActivities !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousNetCashFromOperatingActivities)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Investing Activities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.investingActivities')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousNetCashFromInvestingActivities !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Investing Activities Items */}
                {data.investingActivities.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousNetCashFromInvestingActivities !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Investing Activities */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.netCashFromInvestingActivities')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.netCashFromInvestingActivities)}
                  </TableCell>
                  {data.previousNetCashFromInvestingActivities !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousNetCashFromInvestingActivities)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Financing Activities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accounting.financialStatements.financingActivities')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.financialStatements.code')}</TableHead>
                  <TableHead>{t('accounting.financialStatements.item')}</TableHead>
                  <TableHead className="text-right">{t('accounting.financialStatements.amount')}</TableHead>
                  {data.previousNetCashFromFinancingActivities !== undefined && (
                    <TableHead className="text-right">{t('accounting.financialStatements.previousAmount')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Financing Activities Items */}
                {data.financingActivities.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.value)}</TableCell>
                    {data.previousNetCashFromFinancingActivities !== undefined && (
                      <TableCell className="text-right font-mono">{formatCurrency(item.previousValue || 0)}</TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total Financing Activities */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.netCashFromFinancingActivities')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.netCashFromFinancingActivities)}
                  </TableCell>
                  {data.previousNetCashFromFinancingActivities !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousNetCashFromFinancingActivities)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Net Change in Cash */}
          <div>
            <Table>
              <TableBody>
                <TableRow className="font-bold bg-muted">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.netChangeInCash')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.netChangeInCash)}
                  </TableCell>
                  {data.previousNetChangeInCash !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousNetChangeInCash)}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Cash Balances */}
          <div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.openingCashBalance')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.openingCashBalance)}
                  </TableCell>
                  {data.previousOpeningCashBalance !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousOpeningCashBalance)}
                    </TableCell>
                  )}
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell></TableCell>
                  <TableCell>{t('accounting.financialStatements.closingCashBalance')}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.closingCashBalance)}
                  </TableCell>
                  {data.previousClosingCashBalance !== undefined && (
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.previousClosingCashBalance)}
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

export default CashFlowStatementView;
