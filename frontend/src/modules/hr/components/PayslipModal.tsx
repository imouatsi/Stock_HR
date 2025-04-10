import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Employee } from '@/services/hrService';
import { PayrollCalculation } from '@/types/payroll';
import PayslipTemplate from './PayslipTemplate';
import { toast } from '@/components/ui/use-toast';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  calculations: PayrollCalculation;
  month: number;
  year: number;
}

const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  employee,
  calculations,
  month,
  year,
}) => {
  const { t } = useTranslation();
  const payslipRef = useRef<HTMLDivElement>(null);

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => payslipRef.current,
    documentTitle: `Payslip-${employee?.firstName}-${employee?.lastName}-${month}-${year}`,
    onBeforeGetContent: () => {
      return new Promise<void>((resolve) => {
        resolve();
      });
    },
    onAfterPrint: () => {
      toast({
        title: t('hr.payroll.success.printed'),
        description: t('hr.payroll.success.printedDescription'),
      });
    },
  });

  // Handle download as PDF
  const handleDownload = () => {
    // In a real application, we would use a library like jsPDF to generate a PDF
    // For now, we'll just show a toast message
    toast({
      title: t('hr.payroll.success.downloaded'),
      description: t('hr.payroll.success.downloadedDescription'),
    });
  };

  if (!employee) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('hr.payroll.payslipTitle')}</DialogTitle>
          <DialogDescription>
            {t('hr.payroll.payslipDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <PayslipTemplate
            ref={payslipRef}
            employee={employee}
            calculations={calculations}
            month={month}
            year={year}
          />
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t('common.close')}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDownload}>
              {t('hr.payroll.download')}
            </Button>
            <Button onClick={handlePrint}>
              {t('hr.payroll.print')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayslipModal;
