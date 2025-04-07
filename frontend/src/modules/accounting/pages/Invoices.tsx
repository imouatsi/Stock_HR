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

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const Invoices: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddInvoice = () => {
    // TODO: Implement add invoice functionality
    toast({
      title: t('common.notImplemented'),
      description: t('common.featureComingSoon'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('accounting.invoices.title')}</h1>
        <Button onClick={handleAddInvoice}>
          {t('accounting.invoices.addInvoice')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('accounting.invoices.number')}</TableHead>
              <TableHead>{t('accounting.invoices.date')}</TableHead>
              <TableHead>{t('accounting.invoices.dueDate')}</TableHead>
              <TableHead>{t('accounting.invoices.client')}</TableHead>
              <TableHead>{t('accounting.invoices.amount')}</TableHead>
              <TableHead>{t('accounting.invoices.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.number}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t(`accounting.invoices.status.${invoice.status}`)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast({
                          title: t('common.notImplemented'),
                          description: t('common.featureComingSoon'),
                        });
                      }}
                    >
                      {t('common.edit')}
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

export default Invoices; 