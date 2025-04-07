import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { employeeService } from '../services/EmployeeService';
import { Employee } from '../types/employee.types';
import { formatCurrency } from '../../../utils/format';

export const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEmployee(id);
    }
  }, [id]);

  const fetchEmployee = async (employeeId: string) => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployee(employeeId);
      setEmployee(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employee details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !employee) {
    return <div className="text-red-500">{error || 'Employee not found'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {employee.firstName} {employee.lastName}
        </h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate('/hr/employees')}>
            Back to List
          </Button>
          <Button onClick={() => navigate(`/hr/employees/${id}/edit`)}>
            Edit Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{employee.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={employee.status === 'active' ? 'success' : 'destructive'}>
                  {employee.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{employee.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">
                  {employee.role === 'SU' ? 'Super User (Developer)' :
                   employee.role === 'UA' ? 'User Admin (Client)' :
                   'Regular User'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{new Date(employee.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hire Date</p>
                <p className="font-medium">{new Date(employee.hireDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{employee.department?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{employee.position?.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">{formatCurrency(employee.salary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{employee.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Relationship</p>
                <p className="font-medium">{employee.emergencyContact.relationship}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{employee.emergencyContact.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 