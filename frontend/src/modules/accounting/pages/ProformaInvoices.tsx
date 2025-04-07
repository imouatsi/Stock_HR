import React from 'react';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/ui/data-table';
import { columns } from './proformaColumns';
import type { ProformaInvoice } from './proformaColumns';

export const ProformaInvoices = () => {
  const data: ProformaInvoice[] = [
    {
      id: '1',
      invoiceNumber: 'PRO-001',
      date: '2024-01-01',
      customer: 'John Doe',
      amount: 1500,
      status: 'draft',
    },
    {
      id: '2',
      invoiceNumber: 'PRO-002',
      date: '2024-01-02',
      customer: 'Jane Smith',
      amount: 2500,
      status: 'sent',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proforma Invoices</h1>
        <Button>Create New Proforma Invoice</Button>
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="invoiceNumber"
      />
    </div>
  );
}; 