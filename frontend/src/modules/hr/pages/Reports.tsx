import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './reports/columns';

const data = [
  {
    id: '1',
    title: 'Monthly Employee Turnover',
    type: 'Analytics',
    createdBy: 'John Doe',
    createdDate: '2024-03-01',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Training Effectiveness Report',
    type: 'Evaluation',
    createdBy: 'Jane Smith',
    createdDate: '2024-03-05',
    status: 'in-progress',
  },
];

export default function Reports() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button>Generate Report</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 