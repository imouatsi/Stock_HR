import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/ui/data-table';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import { columns } from './employeeColumns';
import { employeeService } from '../services/EmployeeService';
import { Employee, EmployeeFilters } from '../types/employee.types';

export const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (filters?: EmployeeFilters) => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees(filters);
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
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
        <h1 className="text-3xl font-bold">Employees</h1>
        <Button onClick={() => navigate('/hr/employees/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={employees} 
        searchKey="employeeId"
        loading={loading}
      />
    </div>
  );
}; 