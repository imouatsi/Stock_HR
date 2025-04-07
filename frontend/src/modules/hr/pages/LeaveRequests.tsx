import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './leave-requests/columns';

const data = [
  {
    id: '1',
    employee: 'John Doe',
    type: 'Annual Leave',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    status: 'pending',
    reason: 'Family vacation',
  },
  {
    id: '2',
    employee: 'Jane Smith',
    type: 'Sick Leave',
    startDate: '2024-03-10',
    endDate: '2024-03-11',
    status: 'approved',
    reason: 'Medical appointment',
  },
];

export default function LeaveRequests() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leave Requests</h1>
        <Button>New Request</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 