import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { accountingService } from '@/services/accountingService';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/ui/data-table';
import { columns } from './proformaColumns';
import type { ProformaInvoice } from './proformaColumns';

export const ProformaInvoices = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [proformas, setProformas] = useState<ProformaInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProformas();
  }, []);

  const fetchProformas = async () => {
    try {
      setIsLoading(true);
      const data = await accountingService.getAllProformaInvoices();
      setProformas(data.map(inv => ({
        id: inv._id || inv.id,
        invoiceNumber: inv.number || inv.invoiceNumber,
        date: inv.date || inv.issuedDate,
        customer: inv.client || (inv.customer?.name || inv.customer),
        amount: inv.amount || inv.total,
        status: inv.status?.toLowerCase() || inv.status
      })));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load proforma invoices.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProforma = () => {
    toast({
      title: 'Not Implemented',
      description: 'This feature is coming soon.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proforma Invoices</h1>
        <Button onClick={handleCreateProforma}>
          Create New Proforma
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={proformas}
          searchKey="invoiceNumber"
        />
      )}
    </div>
  );
};