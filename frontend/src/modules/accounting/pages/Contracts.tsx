import React from 'react';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/ui/data-table';
import { columns } from './columns';

export default function Contracts() {
  const data = [
    {
      id: '1',
      contractNumber: 'CNT-001',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      client: 'Acme Corp',
      value: 50000,
      status: 'active',
    },
    {
      id: '2',
      contractNumber: 'CNT-002',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      client: 'XYZ Inc',
      value: 75000,
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <Button>Create New Contract</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 