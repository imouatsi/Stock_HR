import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './training/columns';

const data = [
  {
    id: '1',
    title: 'React Advanced Concepts',
    trainer: 'John Doe',
    startDate: '2024-04-01',
    endDate: '2024-04-03',
    location: 'Conference Room A',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Project Management Fundamentals',
    trainer: 'Jane Smith',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    location: 'Training Room B',
    status: 'completed',
  },
];

export default function Training() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Training</h1>
        <Button>New Training</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 