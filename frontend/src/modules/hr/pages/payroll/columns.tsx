import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Payroll = {
  id: string;
  employee: string;
  department: string;
  position: string;
  salary: number;
  paymentDate: string;
  status: 'pending' | 'paid' | 'failed';
};

export const columns: ColumnDef<Payroll>[] = [
  {
    accessorKey: 'employee',
    header: 'Employee',
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
    accessorKey: 'salary',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Salary
        </Button>
      );
    },
  },
  {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = {
        pending: 'secondary',
        paid: 'default',
        failed: 'destructive',
      }[status] as 'default' | 'secondary' | 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payroll = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payroll.id)}
            >
              Copy payroll ID
            </DropdownMenuItem>
            <DropdownMenuItem>View payroll details</DropdownMenuItem>
            <DropdownMenuItem>Process payment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 