import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './departments/columns';

const data = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and engineering department',
    manager: 'John Doe',
    employeeCount: 25,
    status: 'active',
  },
  {
    id: '2',
    name: 'Marketing',
    description: 'Marketing and communications department',
    manager: 'Jane Smith',
    employeeCount: 15,
    status: 'active',
  },
];

export default function Departments() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Departments</h1>
        <Button>Add Department</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 