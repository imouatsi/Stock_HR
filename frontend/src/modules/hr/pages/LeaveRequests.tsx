import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { hrService } from '@/services/hrService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './leave-requests/columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { LeaveRequest } from './leave-requests/columns';

export default function LeaveRequests() {

  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const data = await hrService.getAllLeaveRequests();
      setLeaveRequests(data.map(req => ({
        id: req._id || req.id,
        employee: req.employeeName || req.employee,
        type: req.type,
        startDate: req.startDate,
        endDate: req.endDate,
        status: req.status,
        reason: req.reason
      })));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load leave requests.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    employeeId: '',
    employeeName: '',
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleNewRequest = () => {
    setIsNewRequestModalOpen(true);
  };

  const handleSubmitRequest = async () => {
    try {
      setIsLoading(true);
      await hrService.createLeaveRequest(newRequest);
      toast({
        title: 'Success',
        description: 'Leave request submitted successfully',
        variant: 'default',
      });
      setIsNewRequestModalOpen(false);
      setNewRequest({
        employeeId: '',
        employeeName: '',
        type: 'annual',
        startDate: '',
        endDate: '',
        reason: ''
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit leave request',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leave Requests</h1>
        <Button onClick={handleNewRequest}>
          New Leave Request
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={leaveRequests} searchKey="employee" />
      )}

      {/* New Leave Request Modal */}
      <Dialog open={isNewRequestModalOpen} onOpenChange={setIsNewRequestModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit New Leave Request</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Employee ID:</div>
              <Input
                value={newRequest.employeeId}
                onChange={(e) => setNewRequest({...newRequest, employeeId: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Employee Name:</div>
              <Input
                value={newRequest.employeeName}
                onChange={(e) => setNewRequest({...newRequest, employeeName: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Leave Type:</div>
              <div className="col-span-3">
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Start Date:</div>
              <Input
                type="date"
                value={newRequest.startDate}
                onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">End Date:</div>
              <Input
                type="date"
                value={newRequest.endDate}
                onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Reason:</div>
              <Textarea
                value={newRequest.reason}
                onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsNewRequestModalOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSubmitRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}