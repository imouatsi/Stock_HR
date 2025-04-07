import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './employees/columns';

const data = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    department: 'Engineering',
    position: 'Senior Developer',
    hireDate: '2023-01-15',
    salary: 85000,
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    department: 'Marketing',
    position: 'Marketing Manager',
    hireDate: '2023-03-20',
    salary: 75000,
    status: 'active',
  },
];

export default function Employees() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Button>Add Employee</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
} 