import React from 'react';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/ui/data-table';
import { columns } from './columns';
import type { Invoice } from './columns';

export const Invoices = () => {
  const data: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      date: '2024-01-01',
      customer: 'John Doe',
      amount: 1000,
      status: 'paid',
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      date: '2024-01-02',
      customer: 'Jane Smith',
      amount: 2000,
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button>Create New Invoice</Button>
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="invoiceNumber"
      />
    </div>
  );
}; 