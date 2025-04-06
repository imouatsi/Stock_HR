import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="ghost"
          onClick={() => navigate(`/hr/employees/${row.original.id}`)}
        >
          View Details
        </Button>
      );
    },
  },
];

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch employees from API
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <DataTable columns={columns} data={employees} loading={loading} />
    </div>
  );
}; 