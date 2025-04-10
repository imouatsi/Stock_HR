import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { hrService } from '@/services/hrService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './positions/columns';

interface Position {
  id: string;
  title: string;
  department: string;
  minSalary?: number;
  maxSalary?: number;
  description?: string;
  status?: string;
}

export default function Positions() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const data = await hrService.getAllPositions();
      setPositions(data.map(pos => ({
        id: pos._id || pos.id,
        title: pos.title,
        department: pos.department,
        minSalary: pos.salaryRange?.min,
        maxSalary: pos.salaryRange?.max,
        description: pos.description,
        status: pos.status || 'active'
      })));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load positions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPosition = () => {
    toast({
      title: 'Not Implemented',
      description: 'This feature is coming soon.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Positions</h1>
        <Button onClick={handleAddPosition}>
          Add Position
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={positions || []} searchKey="title" />
      )}
    </div>
  );
}