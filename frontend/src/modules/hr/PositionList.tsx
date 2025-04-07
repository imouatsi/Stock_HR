import React from 'react';
import { DataTable } from '../../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Position } from '@/types/position';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const columns: ColumnDef<Position>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'level',
    header: 'Level',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="ghost"
          onClick={() => navigate(`/hr/positions/${row.original.id}`)}
        >
          View Details
        </Button>
      );
    },
  },
];

export const PositionList: React.FC = () => {
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch positions from API
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Positions</h1>
      <DataTable columns={columns} data={positions} loading={loading} />
    </div>
  );
}; 