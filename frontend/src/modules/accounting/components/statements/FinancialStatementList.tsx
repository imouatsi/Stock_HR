import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FinancialStatementReport } from '@/types/financial-statements';
import { AccountingPeriod } from '@/types/accounting';
import { FileDown, FileText, Eye, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FinancialStatementListProps {
  statements: FinancialStatementReport[];
  periods: AccountingPeriod[];
  isLoading: boolean;
  formatDate: (dateString: string) => string;
  onViewStatement: (id: string) => void;
  onFinalizeStatement: (id: string) => void;
  onExportToPDF: (id: string) => void;
  onExportToExcel: (id: string) => void;
}

const FinancialStatementList: React.FC<FinancialStatementListProps> = ({ 
  statements,
  periods,
  isLoading,
  formatDate,
  onViewStatement,
  onFinalizeStatement,
  onExportToPDF,
  onExportToExcel
}) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
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
              <TableRow key={statement._id}>
                <TableCell>
                  {statement.type === 'balance_sheet' ? t('accounting.financialStatements.balanceSheet') :
                   statement.type === 'income_statement' ? t('accounting.financialStatements.incomeStatement') :
                   statement.type === 'cash_flow' ? t('accounting.financialStatements.cashFlowStatement') : statement.type}
                </TableCell>
                <TableCell>
                  {periods.find(p => p._id === statement.periodId)?.name || statement.periodId}
                </TableCell>
                <TableCell>{formatDate(statement.date)}</TableCell>
                <TableCell>
                  <Badge
                    className={statement.status === 'final' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {statement.status === 'draft' ? t('accounting.financialStatements.status.draft') :
                     statement.status === 'final' ? t('accounting.financialStatements.status.final') : statement.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewStatement(statement._id || '')}
                      title={t('common.view')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {statement.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onFinalizeStatement(statement._id || '')}
                        title={t('accounting.financialStatements.finalize')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onExportToPDF(statement._id || '')}
                      title={t('accounting.financialStatements.exportPDF')}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onExportToExcel(statement._id || '')}
                      title={t('accounting.financialStatements.exportExcel')}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinancialStatementList;
