import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { hrService } from '@/services/hrService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './departments/columns';

interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  employeeCount: number;
  status: string;
}

export default function Departments() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const data = await hrService.getAllDepartments();
      setDepartments(data.map(dept => ({
        id: dept._id || dept.id,
        name: dept.name,
        description: dept.description,
        manager: dept.manager,
        employeeCount: dept.employeeCount || 0,
        status: dept.status || 'active'
      })));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load departments.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDepartment = () => {
    toast({
      title: 'Not Implemented',
      description: 'This feature is coming soon.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Departments</h1>
        <Button onClick={handleAddDepartment}>
          Add Department
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={departments || []} searchKey="name" />
      )}
    </div>
  );
}