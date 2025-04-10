import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { hrService } from '@/services/hrService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './positions/columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { Position } from './positions/columns';

export default function Positions() {

  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const data = await hrService.getAllPositions();
      setPositions(data.map(pos => ({
        id: pos._id || pos.id,
        title: pos.title,
        department: pos.department,
        minSalary: pos.salaryRange?.min,
        maxSalary: pos.salaryRange?.max,
        description: pos.description,
        status: pos.status || 'active'
      })));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load positions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPosition, setNewPosition] = useState({
    title: '',
    department: '',
    minSalary: 0,
    maxSalary: 0,
    description: '',
    status: 'active'
  });

  const handleAddPosition = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitPosition = async () => {
    try {
      setIsLoading(true);
      await hrService.createPosition(newPosition);
      toast({
        title: 'Success',
        description: 'Position added successfully',
        variant: 'default',
      });
      setIsAddModalOpen(false);
      setNewPosition({
        title: '',
        department: '',
        minSalary: 0,
        maxSalary: 0,
        description: '',
        status: 'active'
      });
      fetchPositions();
    } catch (error) {
      console.error('Error adding position:', error);
      toast({
        title: 'Error',
        description: 'Failed to add position',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Positions</h1>
        <Button onClick={handleAddPosition}>
          Add Position
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={positions || []} searchKey="title" />
      )}

      {/* Add Position Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Position</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Title:</div>
              <Input
                value={newPosition.title}
                onChange={(e) => setNewPosition({...newPosition, title: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Department:</div>
              <Input
                value={newPosition.department}
                onChange={(e) => setNewPosition({...newPosition, department: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Min Salary (DZD):</div>
              <Input
                type="number"
                value={newPosition.minSalary}
                onChange={(e) => setNewPosition({...newPosition, minSalary: parseInt(e.target.value) || 0})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Max Salary (DZD):</div>
              <Input
                type="number"
                value={newPosition.maxSalary}
                onChange={(e) => setNewPosition({...newPosition, maxSalary: parseInt(e.target.value) || 0})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Description:</div>
              <Textarea
                value={newPosition.description}
                onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Status:</div>
              <div className="col-span-3">
                <select
                  value={newPosition.status}
                  onChange={(e) => setNewPosition({...newPosition, status: e.target.value})}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSubmitPosition}>Add Position</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}