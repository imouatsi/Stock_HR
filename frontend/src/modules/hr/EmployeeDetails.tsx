import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';

export const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch employee details from API
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Personal Information</h3>
              <p>Name: {employee.firstName} {employee.lastName}</p>
              <p>Email: {employee.email}</p>
              <p>Phone: {employee.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold">Work Information</h3>
              <p>Department: {employee.department}</p>
              <p>Position: {employee.position}</p>
              <p>Hire Date: {employee.hireDate}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline">Edit Employee</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 