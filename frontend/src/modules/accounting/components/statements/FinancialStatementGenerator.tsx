import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccountingPeriod } from '@/types/accounting';
import { FilePlus } from 'lucide-react';
import { accountingService } from '@/services/accountingService';
import { FinancialStatementReport } from '@/types/financial-statements';

interface FinancialStatementGeneratorProps {
  periods: AccountingPeriod[];
  onStatementGenerated: (statement: FinancialStatementReport) => void;
}

const FinancialStatementGenerator: React.FC<FinancialStatementGeneratorProps> = ({ 
  periods,
  onStatementGenerated
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state for generating a new statement
  const [formData, setFormData] = useState({
    type: 'balance_sheet' as 'balance_sheet' | 'income_statement' | 'cash_flow',
    periodId: '',
    comparisonPeriodId: ''
  });

  // Handle opening the generate statement dialog
  const handleGenerateStatement = () => {
    // Set default period if available
    if (periods.length > 0 && !formData.periodId) {
      const currentPeriod = periods.find(p => !p.isClosed);
      if (currentPeriod) {
        setFormData(prev => ({
          ...prev,
          periodId: currentPeriod._id || ''
        }));
      }
    }
    
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle generating a financial statement
  const handleSubmitGenerate = async () => {
    try {
      setIsGenerating(true);

      const { type, periodId, comparisonPeriodId } = formData;

      if (!type || !periodId) {
        toast({
          title: t('common.error.title'),
          description: t('accounting.financialStatements.error.missingFields'),
          variant: 'destructive',
        });
        return;
      }

      const result = await accountingService.generateFinancialStatement(
        type,
        periodId,
        comparisonPeriodId || undefined
      );

      // Close the dialog
      setIsDialogOpen(false);

      // Notify parent component
      onStatementGenerated(result);

      toast({
        title: t('common.success'),
        description: t('accounting.financialStatements.success.generated'),
      });
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.financialStatements.error.generating'),
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button onClick={handleGenerateStatement}>
        <FilePlus className="h-4 w-4 mr-2" />
        {t('accounting.financialStatements.generateStatement')}
      </Button>

      {/* Generate Statement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('accounting.financialStatements.generateStatement')}</DialogTitle>
            <DialogDescription>
              {t('accounting.financialStatements.generateDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">{t('accounting.financialStatements.type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder={t('accounting.financialStatements.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance_sheet">{t('accounting.financialStatements.balanceSheet')}</SelectItem>
                  <SelectItem value="income_statement">{t('accounting.financialStatements.incomeStatement')}</SelectItem>
                  <SelectItem value="cash_flow">{t('accounting.financialStatements.cashFlowStatement')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodId">{t('accounting.financialStatements.period')}</Label>
              <Select
                value={formData.periodId}
                onValueChange={(value) => handleSelectChange('periodId', value)}
              >
                <SelectTrigger id="periodId">
                  <SelectValue placeholder={t('accounting.financialStatements.selectPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem
                      key={period._id}
                      value={period._id || ''}
                    >
                      {period.name} {period.isClosed && `(${t('accounting.accountingPeriods.closed')})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comparisonPeriodId">{t('accounting.financialStatements.comparisonPeriod')}</Label>
              <Select
                value={formData.comparisonPeriodId}
                onValueChange={(value) => handleSelectChange('comparisonPeriodId', value)}
              >
                <SelectTrigger id="comparisonPeriodId">
                  <SelectValue placeholder={t('accounting.financialStatements.selectComparisonPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('accounting.financialStatements.noComparison')}</SelectItem>
                  {periods.map((period) => (
                    <SelectItem
                      key={period._id}
                      value={period._id || ''}
                      disabled={period._id === formData.periodId}
                    >
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">{t('accounting.financialStatements.comparisonDescription')}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmitGenerate} disabled={isGenerating}>
              {isGenerating ? t('common.generating') : t('common.generate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinancialStatementGenerator;
