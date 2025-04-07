import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './performance-reviews/columns';

const data = [
  {
    id: '1',
    employee: 'John Doe',
    reviewer: 'Jane Smith',
    reviewDate: '2024-03-15',
    rating: 4.5,
    status: 'completed',
  },
  {
    id: '2',
    employee: 'Jane Smith',
    reviewer: 'John Doe',
    reviewDate: '2024-03-20',
    rating: 4.0,
    status: 'pending',
  },
];

export default function PerformanceReviews() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Performance Reviews</h1>
        <Button>New Review</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 