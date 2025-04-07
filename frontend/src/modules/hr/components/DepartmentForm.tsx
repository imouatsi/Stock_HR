import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { departmentService } from '../services/DepartmentService';
import { employeeService } from '../services/EmployeeService';
import { DepartmentFormData } from '../types/department.types';
import { Employee } from '../types/employee.types';

interface DepartmentFormProps {
  initialData?: DepartmentFormData;
  onSubmit: (data: DepartmentFormData) => Promise<void>;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({ initialData, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DepartmentFormData>(initialData || {
    code: '',
    name: '',
    description: '',
    managerId: '',
    parentDepartmentId: '',
    status: 'active',
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployeesAndDepartments();
  }, []);

  const fetchEmployeesAndDepartments = async () => {
    try {
      const [emps, depts] = await Promise.all([
        employeeService.getEmployees(),
        departmentService.getDepartments(),
      ]);
      setEmployees(emps);
      setDepartments(depts);
    } catch (err) {
      setError('Failed to fetch employees and departments');
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit(formData);
      navigate('/hr/departments');
    } catch (err) {
      setError('Failed to save department');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => navigate('/hr/departments')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Department' : 'Add New Department'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update department information' : 'Fill in the details to add a new department'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerId">Manager</Label>
              <Select
                value={formData.managerId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {`${emp.firstName} ${emp.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentDepartmentId">Parent Department</Label>
              <Select
                value={formData.parentDepartmentId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parentDepartmentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/hr/departments')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 