import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './payroll/columns';

const data = [
  {
    id: '1',
    employee: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 85000,
    paymentDate: '2024-03-31',
    status: 'paid',
  },
  {
    id: '2',
    employee: 'Jane Smith',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 75000,
    paymentDate: '2024-03-31',
    status: 'pending',
  },
];

export default function Payroll() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payroll</h1>
        <Button>Process Payroll</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 