import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { departmentService } from '../services/DepartmentService';
import { Department } from '../types/department.types';

export const DepartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDepartment(id);
    }
  }, [id]);

  const fetchDepartment = async (departmentId: string) => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartment(departmentId);
      setDepartment(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch department details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !department) {
    return <div className="text-red-500">{error || 'Department not found'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{department.name}</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate('/hr/departments')}>
            Back to List
          </Button>
          <Button onClick={() => navigate(`/hr/departments/${id}/edit`)}>
            Edit Department
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="font-medium">{department.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={department.status === 'active' ? 'success' : 'destructive'}>
                  {department.status}
                </Badge>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{department.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Manager</p>
                <p className="font-medium">
                  {department.manager
                    ? `${department.manager.firstName} ${department.manager.lastName}`
                    : 'Not assigned'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parent Department</p>
                <p className="font-medium">
                  {department.parentDepartment?.name || 'None'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {department.employees && department.employees.length > 0 ? (
              <div className="space-y-4">
                {department.employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {employee.position?.title}
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
              <p className="text-muted-foreground">No employees in this department</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 