import React from 'react';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/ui/data-table';
import { columns } from './columns';

export default function Proformas() {
  const data = [
    {
      id: '1',
      proformaNumber: 'PRO-001',
      date: '2024-01-01',
      client: 'Acme Corp',
      amount: 10000,
      status: 'draft',
    },
    {
      id: '2',
      proformaNumber: 'PRO-002',
      date: '2024-01-02',
      client: 'XYZ Inc',
      amount: 15000,
      status: 'sent',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proformas</h1>
        <Button>Create New Proforma</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 