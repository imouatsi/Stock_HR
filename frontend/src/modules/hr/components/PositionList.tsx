import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/ui/data-table';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import { columns } from './positionColumns';
import { positionService } from '../services/PositionService';
import { Position, PositionFilters } from '../types/position.types';

export const PositionList: React.FC = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async (filters?: PositionFilters) => {
    try {
      setLoading(true);
      const data = await positionService.getPositions(filters);
      setPositions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch positions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Positions</h1>
        <Button onClick={() => navigate('/hr/positions/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Position
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={positions} 
        searchKey="title"
        loading={loading}
      />
    </div>
  );
}; 