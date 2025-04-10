import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { hrService } from '@/services/hrService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './departments/columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  employeeCount: number;
  status: string;
}

export default function Departments() {

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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '', managerId: '' });

  const handleAddDepartment = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      setIsLoading(true);
      await hrService.createDepartment(newDepartment);
      toast({
        title: 'Success',
        description: 'Department added successfully',
        variant: 'default',
      });
      setIsAddModalOpen(false);
      setNewDepartment({ name: '', description: '', managerId: '' });
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
      toast({
        title: 'Error',
        description: 'Failed to add department',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

      {/* Add Department Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Name:</div>
              <Input
                id="name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Description:</div>
              <Textarea
                id="description"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Manager ID:</div>
              <Input
                id="managerId"
                value={newDepartment.managerId}
                onChange={(e) => setNewDepartment({...newDepartment, managerId: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAddSubmit}>Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}