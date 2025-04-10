import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { hrService } from '@/services/hrService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './leave-requests/columns';

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  reason?: string;
}

export default function LeaveRequests() {
  const { t } = useTranslation();
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

  const handleNewRequest = () => {
    toast({
      title: 'Not Implemented',
      description: 'This feature is coming soon.',
    });
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
    </div>
  );
}