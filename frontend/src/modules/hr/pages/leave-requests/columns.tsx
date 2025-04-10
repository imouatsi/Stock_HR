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

export type LeaveRequest = {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
};

export const columns: ColumnDef<LeaveRequest, unknown>[] = [
  {
    accessorKey: 'employee',
    header: 'Employee',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = {
        pending: 'secondary',
        approved: 'default',
        rejected: 'destructive',
      }[status] as 'default' | 'secondary' | 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const request = row.original;

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
              onClick={() => navigator.clipboard.writeText(request.id)}
            >
              Copy request ID
            </DropdownMenuItem>
            <DropdownMenuItem>View request details</DropdownMenuItem>
            <DropdownMenuItem>Approve/Reject request</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];