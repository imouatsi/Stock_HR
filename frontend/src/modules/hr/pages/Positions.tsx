import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './positions/columns';

const data = [
  {
    id: '1',
    title: 'Senior Developer',
    department: 'Engineering',
    minSalary: 80000,
    maxSalary: 120000,
    description: 'Senior software development position',
    status: 'active',
  },
  {
    id: '2',
    title: 'Marketing Manager',
    department: 'Marketing',
    minSalary: 70000,
    maxSalary: 100000,
    description: 'Marketing department leadership position',
    status: 'active',
  },
];

export default function Positions() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Positions</h1>
        <Button>Add Position</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 