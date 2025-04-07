import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/ui/data-table';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import { columns } from './departmentColumns';
import { departmentService } from '../services/DepartmentService';
import { Department, DepartmentFilters } from '../types/department.types';

export const DepartmentList: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async (filters?: DepartmentFilters) => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartments(filters);
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
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
        <h1 className="text-3xl font-bold">Departments</h1>
        <Button onClick={() => navigate('/hr/departments/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={departments} 
        searchKey="name"
        loading={loading}
      />
    </div>
  );
}; 