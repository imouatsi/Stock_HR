import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { positionService } from '../services/PositionService';
import { Position } from '../types/position.types';
import { formatCurrency } from '../../../utils/format';

export const PositionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPosition(id);
    }
  }, [id]);

  const fetchPosition = async (positionId: string) => {
    try {
      setLoading(true);
      const data = await positionService.getPosition(positionId);
      setPosition(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch position details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !position) {
    return <div className="text-red-500">{error || 'Position not found'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{position.title}</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate('/hr/positions')}>
            Back to List
          </Button>
          <Button onClick={() => navigate(`/hr/positions/${id}/edit`)}>
            Edit Position
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Position Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="font-medium">{position.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={position.status === 'active' ? 'success' : 'destructive'}>
                  {position.status}
                </Badge>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{position.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department & Salary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{position.department?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salary Range</p>
                <p className="font-medium">
                  {formatCurrency(position.salaryRange.min)} -{' '}
                  {formatCurrency(position.salaryRange.max)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Employees in this Position</CardTitle>
          </CardHeader>
          <CardContent>
            {position.employees && position.employees.length > 0 ? (
              <div className="space-y-4">
                {position.employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {employee.department?.name}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/hr/employees/${employee.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No employees in this position</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 