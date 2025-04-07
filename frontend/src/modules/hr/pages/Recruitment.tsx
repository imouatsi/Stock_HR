import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './recruitment/columns';

const data = [
  {
    id: '1',
    position: 'Senior Developer',
    department: 'Engineering',
    candidate: 'John Smith',
    applicationDate: '2024-03-01',
    status: 'interview',
    source: 'LinkedIn',
  },
  {
    id: '2',
    position: 'Marketing Manager',
    department: 'Marketing',
    candidate: 'Jane Doe',
    applicationDate: '2024-03-05',
    status: 'offer',
    source: 'Company Website',
  },
];

export default function Recruitment() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recruitment</h1>
        <Button>New Position</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 