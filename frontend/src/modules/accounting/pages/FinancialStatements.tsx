import React, { useState, useEffect, useRef } from 'react';
import { accountingService } from '@/services/accountingService';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialStatementReport, BalanceSheet, IncomeStatement, CashFlowStatement } from '@/types/financial-statements';
import { AccountingPeriod } from '@/types/accounting';
import { useToast } from '@/components/ui/use-toast';

// Import statement components
import BalanceSheetView from '../components/statements/BalanceSheetView';
import IncomeStatementView from '../components/statements/IncomeStatementView';
import CashFlowStatementView from '../components/statements/CashFlowStatementView';
import FinancialStatementDetails from '../components/statements/FinancialStatementDetails';
import FinancialStatementGenerator from '../components/statements/FinancialStatementGenerator';
import FinancialStatementList from '../components/statements/FinancialStatementList';
import FinancialStatementActions from '../components/statements/FinancialStatementActions';

const FinancialStatements: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // State for financial statements
  const [statements, setStatements] = useState<FinancialStatementReport[]>([]);
  const [selectedStatement, setSelectedStatement] = useState<FinancialStatementReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  
  // State for accounting periods
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  
  // Reference for printing
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch financial statements and accounting periods
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [statementsData, periodsData] = await Promise.all([
        accountingService.getFinancialStatements(),
        accountingService.getAccountingPeriods()
      ]);
      
      setStatements(statementsData);
      setPeriods(periodsData);
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.financialStatements.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-DZ');
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle statement generation from the generator component
  const handleStatementGenerated = (statement: FinancialStatementReport) => {
    // Add the new statement to the list
    setStatements(prev => [statement, ...prev]);
  };

  // Handle viewing a financial statement
  const handleViewStatement = async (id: string) => {
    try {
      setIsLoading(true);
      const statement = await accountingService.getFinancialStatementById(id);
      if (statement) {
        setSelectedStatement(statement);
        setActiveTab('statement');
      }
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.financialStatements.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle finalizing a financial statement
  const handleFinalizeStatement = async (id: string) => {
    try {
      const result = await accountingService.finalizeFinancialStatement(id);
      
      // Update the statement in the list
      setStatements(prev => 
        prev.map(statement => 
          statement._id === id ? { ...statement, status: 'final' } : statement
        )
      );
      
      // Update the selected statement if it's the one being finalized
      if (selectedStatement && selectedStatement._id === id) {
        setSelectedStatement({ ...selectedStatement, status: 'final' });
      }
      
      toast({
        title: t('common.success'),
        description: t('accounting.financialStatements.success.finalized'),
      });
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.financialStatements.error.finalizing'),
        variant: 'destructive',
      });
    }
  };

  // Handle exporting a financial statement to PDF
  const handleExportToPDF = async (id: string) => {
    try {
      const pdfUrl = await accountingService.exportFinancialStatementToPDF(id);
      window.open(pdfUrl, '_blank');
      
      toast({
        title: t('common.success'),
        description: t('accounting.financialStatements.success.exported'),
      });
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.financialStatements.error.exporting'),
        variant: 'destructive',
      });
    }
  };

  // Handle exporting a financial statement to Excel
  const handleExportToExcel = async (id: string) => {
    try {
      const excelUrl = await accountingService.exportFinancialStatementToExcel(id);
      window.open(excelUrl, '_blank');
      
      toast({
        title: t('common.success'),
        description: t('accounting.financialStatements.success.exported'),
      });
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.financialStatements.error.exporting'),
        variant: 'destructive',
      });
    }
  };

  // Handle printing the current statement
  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = `
        <div class="print-container">
          <style>
            @media print {
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .print-header { text-align: center; margin-bottom: 20px; }
              .print-footer { text-align: center; margin-top: 20px; font-size: 12px; }
            }
          </style>
          <div class="print-header">
            <h1>404 ENTERPRISE</h1>
            <h2>${selectedStatement?.type === 'balance_sheet' ? t('accounting.financialStatements.balanceSheet') : 
                 selectedStatement?.type === 'income_statement' ? t('accounting.financialStatements.incomeStatement') : 
                 t('accounting.financialStatements.cashFlowStatement')}</h2>
            <p>${formatDate(selectedStatement?.date || '')}</p>
          </div>
          ${printContent}
          <div class="print-footer">
            <p>${t('accounting.financialStatements.printedOn')} ${new Date().toLocaleString('fr-DZ')}</p>
          </div>
        </div>
      `;
      
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    } else {
      window.print();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('accounting.financialStatements.title')}</h1>
        <FinancialStatementGenerator 
          periods={periods} 
          onStatementGenerated={handleStatementGenerated} 
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">{t('accounting.financialStatements.statementsList')}</TabsTrigger>
          <TabsTrigger value="statement" disabled={!selectedStatement}>
            {selectedStatement ? (
              selectedStatement.type === 'balance_sheet' ? t('accounting.financialStatements.balanceSheet') :
              selectedStatement.type === 'income_statement' ? t('accounting.financialStatements.incomeStatement') :
              t('accounting.financialStatements.cashFlowStatement')
            ) : t('accounting.financialStatements.statement')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <FinancialStatementList 
            statements={statements}
            periods={periods}
            isLoading={isLoading}
            formatDate={formatDate}
            onViewStatement={handleViewStatement}
            onFinalizeStatement={handleFinalizeStatement}
            onExportToPDF={handleExportToPDF}
            onExportToExcel={handleExportToExcel}
          />
        </TabsContent>

        <TabsContent value="statement" className="space-y-4">
          {selectedStatement && (
            <>
              <FinancialStatementDetails 
                statement={selectedStatement}
                periods={periods}
                formatDate={formatDate}
              />
              
              <div ref={printRef}>
                {/* Render the appropriate statement based on type */}
                {selectedStatement.type === 'balance_sheet' && (
                  <BalanceSheetView 
                    data={selectedStatement.data as BalanceSheet} 
                    formatCurrency={formatCurrency} 
                    formatDate={formatDate} 
                  />
                )}
                
                {selectedStatement.type === 'income_statement' && (
                  <IncomeStatementView 
                    data={selectedStatement.data as IncomeStatement} 
                    formatCurrency={formatCurrency} 
                    formatDate={formatDate} 
                  />
                )}
                
                {selectedStatement.type === 'cash_flow' && (
                  <CashFlowStatementView 
                    data={selectedStatement.data as CashFlowStatement} 
                    formatCurrency={formatCurrency} 
                    formatDate={formatDate} 
                  />
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Statement Actions */}
      {selectedStatement && activeTab === 'statement' && (
        <FinancialStatementActions 
          statement={selectedStatement}
          onFinalizeStatement={handleFinalizeStatement}
          onExportToPDF={handleExportToPDF}
          onExportToExcel={handleExportToExcel}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default FinancialStatements;
