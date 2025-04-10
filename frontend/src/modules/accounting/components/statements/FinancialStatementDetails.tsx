import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialStatementReport } from '@/types/financial-statements';
import { AccountingPeriod } from '@/types/accounting';

interface FinancialStatementDetailsProps {
  statement: FinancialStatementReport;
  periods: AccountingPeriod[];
  formatDate: (dateString: string) => string;
}

const FinancialStatementDetails: React.FC<FinancialStatementDetailsProps> = ({ 
  statement, 
  periods,
  formatDate 
}) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('accounting.financialStatements.statementDetails')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">{t('accounting.financialStatements.type')}:</p>
            <p>
              {statement.type === 'balance_sheet' ? t('accounting.financialStatements.balanceSheet') :
               statement.type === 'income_statement' ? t('accounting.financialStatements.incomeStatement') :
               statement.type === 'cash_flow' ? t('accounting.financialStatements.cashFlowStatement') : statement.type}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('accounting.financialStatements.period')}:</p>
            <p>{periods.find(p => p._id === statement.periodId)?.name || statement.periodId}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('accounting.financialStatements.date')}:</p>
            <p>{formatDate(statement.date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('accounting.financialStatements.status')}:</p>
            <p>
              <Badge
                className={statement.status === 'final' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
              >
                {statement.status === 'draft' ? t('accounting.financialStatements.status.draft') :
                 statement.status === 'final' ? t('accounting.financialStatements.status.final') : statement.status}
              </Badge>
            </p>
          </div>
          {statement.comparisonPeriodId && (
            <div>
              <p className="text-sm font-medium">{t('accounting.financialStatements.comparisonPeriod')}:</p>
              <p>{periods.find(p => p._id === statement.comparisonPeriodId)?.name || statement.comparisonPeriodId}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{t('accounting.financialStatements.createdBy')}:</p>
            <p>{statement.createdBy}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('accounting.financialStatements.createdAt')}:</p>
            <p>{statement.createdAt ? new Date(statement.createdAt).toLocaleString('fr-DZ') : ''}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('accounting.financialStatements.updatedAt')}:</p>
            <p>{statement.updatedAt ? new Date(statement.updatedAt).toLocaleString('fr-DZ') : ''}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialStatementDetails;
