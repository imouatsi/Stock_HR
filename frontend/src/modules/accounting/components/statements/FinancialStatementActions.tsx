import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FinancialStatementReport } from '@/types/financial-statements';
import { FileDown, FileText, CheckCircle, Printer } from 'lucide-react';

interface FinancialStatementActionsProps {
  statement: FinancialStatementReport;
  onFinalizeStatement: (id: string) => void;
  onExportToPDF: (id: string) => void;
  onExportToExcel: (id: string) => void;
  onPrint: () => void;
}

const FinancialStatementActions: React.FC<FinancialStatementActionsProps> = ({ 
  statement,
  onFinalizeStatement,
  onExportToPDF,
  onExportToExcel,
  onPrint
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-wrap gap-2">
      {statement.status === 'draft' && (
        <Button
          variant="outline"
          onClick={() => onFinalizeStatement(statement._id || '')}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {t('accounting.financialStatements.finalize')}
        </Button>
      )}

      <Button
        variant="outline"
        onClick={() => onExportToPDF(statement._id || '')}
      >
        <FileText className="h-4 w-4 mr-2" />
        {t('accounting.financialStatements.exportPDF')}
      </Button>

      <Button
        variant="outline"
        onClick={() => onExportToExcel(statement._id || '')}
      >
        <FileDown className="h-4 w-4 mr-2" />
        {t('accounting.financialStatements.exportExcel')}
      </Button>

      <Button
        variant="outline"
        onClick={onPrint}
      >
        <Printer className="h-4 w-4 mr-2" />
        {t('common.print')}
      </Button>
    </div>
  );
};

export default FinancialStatementActions;
