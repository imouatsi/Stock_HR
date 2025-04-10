import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { CalendarIcon, FileText } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { hrService, Employee } from '@/services/hrService';
import leaveService, { LeaveRequest, LeaveType, LeaveStatus } from '@/services/leaveService';

const LeaveManagement: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicHolidays, setPublicHolidays] = useState<{ date: string; name: string }[]>([]);
  const [remainingLeave, setRemainingLeave] = useState<number>(30); // Default 30 days in Algeria

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    type: LeaveType.ANNUAL,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    reason: '',
    cnasJustification: '',
  });

  useEffect(() => {
    fetchLeaveRequests();
    fetchEmployees();
    fetchPublicHolidays();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const data = await leaveService.getAllLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.leave.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await hrService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchPublicHolidays = async () => {
    // Get public holidays from the service
    const holidays = leaveService.getPublicHolidays();
    setPublicHolidays(holidays);
  };

  const fetchRemainingLeave = async (employeeId: string) => {
    if (!employeeId) return;
    
    try {
      const remaining = await leaveService.getRemainingAnnualLeave(employeeId);
      setRemainingLeave(remaining);
    } catch (error) {
      console.error('Error fetching remaining leave:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If employee changes, fetch their remaining leave
    if (name === 'employeeId') {
      fetchRemainingLeave(value);
    }
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: date
      }));
    }
  };

  // Calculate business days between two dates
  const calculateDuration = (startDate: Date, endDate: Date): number => {
    return leaveService.calculateBusinessDays(startDate, endDate);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      employeeId: '',
      type: LeaveType.ANNUAL,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      reason: '',
      cnasJustification: '',
    });
    setRemainingLeave(30); // Reset to default
  };

  // Open dialog
  const handleAddLeaveRequest = () => {
    setIsDialogOpen(true);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!formData.employeeId || !formData.startDate || !formData.endDate) {
        toast({
          title: t('common.error.title'),
          description: t('hr.leave.error.requiredFields'),
          variant: 'destructive',
        });
        return;
      }
      
      // Validate dates
      if (formData.endDate < formData.startDate) {
        toast({
          title: t('common.error.title'),
          description: t('hr.leave.error.invalidDateRange'),
          variant: 'destructive',
        });
        return;
      }
      
      // Validate CNAS justification for sick leave
      if (formData.type === LeaveType.SICK && !formData.cnasJustification) {
        toast({
          title: t('common.error.title'),
          description: t('hr.leave.error.cnasJustificationRequired'),
          variant: 'destructive',
        });
        return;
      }
      
      // Calculate duration
      const duration = calculateDuration(formData.startDate, formData.endDate);
      
      // Validate annual leave against remaining days
      if (formData.type === LeaveType.ANNUAL && duration > remainingLeave) {
        toast({
          title: t('common.error.title'),
          description: t('hr.leave.error.insufficientLeave', { remaining: remainingLeave }),
          variant: 'destructive',
        });
        return;
      }
      
      // Get employee name for display
      const employee = employees.find(emp => emp._id === formData.employeeId);
      const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
      
      // Create leave request
      const newLeaveRequest = await leaveService.createLeaveRequest({
        ...formData,
        employeeName,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        duration,
        status: LeaveStatus.PENDING,
      });
      
      // Update leave requests list
      setLeaveRequests(prev => [newLeaveRequest, ...prev]);
      
      // Show success message
      toast({
        title: t('common.success'),
        description: t('hr.leave.success.created'),
      });
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating leave request:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.leave.error.creating'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle approve leave request
  const handleApproveLeaveRequest = async (id: string) => {
    try {
      // In a real app, you would get the current user's ID
      const approverId = 'admin';
      
      // Approve the leave request
      const updatedLeaveRequest = await leaveService.approveLeaveRequest(id, approverId);
      
      // Update the leave requests list
      setLeaveRequests(prev => 
        prev.map(request => request._id === id ? updatedLeaveRequest : request)
      );
      
      // Show success message
      toast({
        title: t('common.success'),
        description: t('hr.leave.success.approved'),
      });
    } catch (error) {
      console.error('Error approving leave request:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.leave.error.approving'),
        variant: 'destructive',
      });
    }
  };

  // Handle reject leave request
  const handleRejectLeaveRequest = async (id: string) => {
    try {
      // In a real app, you would get the current user's ID
      const approverId = 'admin';
      
      // Reject the leave request
      const updatedLeaveRequest = await leaveService.rejectLeaveRequest(id, approverId);
      
      // Update the leave requests list
      setLeaveRequests(prev => 
        prev.map(request => request._id === id ? updatedLeaveRequest : request)
      );
      
      // Show success message
      toast({
        title: t('common.success'),
        description: t('hr.leave.success.rejected'),
      });
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.leave.error.rejecting'),
        variant: 'destructive',
      });
    }
  };

  // Get status badge color
  const getStatusBadgeVariant = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return 'success';
      case LeaveStatus.REJECTED:
        return 'destructive';
      case LeaveStatus.CANCELLED:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Get leave type display name
  const getLeaveTypeDisplay = (type: LeaveType) => {
    switch (type) {
      case LeaveType.ANNUAL:
        return t('hr.leave.type.annual');
      case LeaveType.SICK:
        return t('hr.leave.type.sick');
      case LeaveType.MATERNITY:
        return t('hr.leave.type.maternity');
      case LeaveType.UNPAID:
        return t('hr.leave.type.unpaid');
      case LeaveType.PUBLIC_HOLIDAY:
        return t('hr.leave.type.publicHoliday');
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('hr.leave.title')}</h1>
        <Button onClick={handleAddLeaveRequest}>
          {t('hr.leave.addLeaveRequest')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Public Holidays Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('hr.leave.publicHolidays')}</CardTitle>
            <CardDescription>{t('hr.leave.publicHolidaysDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {publicHolidays.map((holiday, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{holiday.name}</span>
                <Badge variant="outline">{holiday.date}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leave Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('hr.leave.statistics')}</CardTitle>
            <CardDescription>{t('hr.leave.statisticsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span>{t('hr.leave.pendingRequests')}</span>
              <Badge variant="secondary">
                {leaveRequests.filter(req => req.status === LeaveStatus.PENDING).length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('hr.leave.approvedRequests')}</span>
              <Badge variant="success">
                {leaveRequests.filter(req => req.status === LeaveStatus.APPROVED).length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('hr.leave.rejectedRequests')}</span>
              <Badge variant="destructive">
                {leaveRequests.filter(req => req.status === LeaveStatus.REJECTED).length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Leave Policy Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('hr.leave.policy')}</CardTitle>
            <CardDescription>{t('hr.leave.policyDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span>{t('hr.leave.annualLeaveEntitlement')}</span>
              <Badge>30 {t('hr.leave.days')}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('hr.leave.sickLeaveRequirement')}</span>
              <Badge variant="outline">{t('hr.leave.cnasJustification')}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('hr.leave.maternityLeave')}</span>
              <Badge>14 {t('hr.leave.weeks')}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('hr.leave.employee')}</TableHead>
              <TableHead>{t('hr.leave.type')}</TableHead>
              <TableHead>{t('hr.leave.startDate')}</TableHead>
              <TableHead>{t('hr.leave.endDate')}</TableHead>
              <TableHead>{t('hr.leave.duration')}</TableHead>
              <TableHead>{t('hr.leave.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            ) : leaveRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              leaveRequests.map((leaveRequest) => (
                <TableRow key={leaveRequest._id}>
                  <TableCell>{leaveRequest.employeeName}</TableCell>
                  <TableCell>{getLeaveTypeDisplay(leaveRequest.type)}</TableCell>
                  <TableCell>{format(new Date(leaveRequest.startDate), 'PPP')}</TableCell>
                  <TableCell>{format(new Date(leaveRequest.endDate), 'PPP')}</TableCell>
                  <TableCell>{leaveRequest.duration} {t('hr.leave.days')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(leaveRequest.status) as any}>
                      {t(`hr.leave.status.${leaveRequest.status.toLowerCase()}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {leaveRequest.status === LeaveStatus.PENDING && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveLeaveRequest(leaveRequest._id)}
                        >
                          {t('hr.leave.approve')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectLeaveRequest(leaveRequest._id)}
                        >
                          {t('hr.leave.reject')}
                        </Button>
                      </div>
                    )}
                    {leaveRequest.type === LeaveType.SICK && leaveRequest.cnasJustification && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          toast({
                            title: t('hr.leave.cnasJustification'),
                            description: leaveRequest.cnasJustification,
                          });
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Leave Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('hr.leave.addLeaveRequest')}</DialogTitle>
            <DialogDescription>
              {t('hr.leave.addLeaveRequestDescription')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">{t('hr.leave.employee')}</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => handleSelectChange('employeeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('hr.leave.selectEmployee')} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('hr.leave.type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value as LeaveType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('hr.leave.selectLeaveType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LeaveType.ANNUAL}>{t('hr.leave.type.annual')}</SelectItem>
                  <SelectItem value={LeaveType.SICK}>{t('hr.leave.type.sick')}</SelectItem>
                  <SelectItem value={LeaveType.MATERNITY}>{t('hr.leave.type.maternity')}</SelectItem>
                  <SelectItem value={LeaveType.UNPAID}>{t('hr.leave.type.unpaid')}</SelectItem>
                </SelectContent>
              </Select>
              
              {formData.type === LeaveType.ANNUAL && (
                <p className="text-sm text-muted-foreground">
                  {t('hr.leave.remainingDays')}: {remainingLeave} {t('hr.leave.days')}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('hr.leave.startDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, 'PPP') : <span>{t('hr.leave.selectDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleDateChange('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>{t('hr.leave.endDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, 'PPP') : <span>{t('hr.leave.selectDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleDateChange('endDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="text-sm">
                <span className="font-medium">{t('hr.leave.duration')}:</span>{' '}
                {calculateDuration(formData.startDate, formData.endDate)} {t('hr.leave.businessDays')}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">{t('hr.leave.reason')}</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {formData.type === LeaveType.SICK && (
              <div className="space-y-2">
                <Label htmlFor="cnasJustification">{t('hr.leave.cnasJustification')}</Label>
                <Input
                  id="cnasJustification"
                  name="cnasJustification"
                  value={formData.cnasJustification}
                  onChange={handleInputChange}
                  placeholder={t('hr.leave.cnasJustificationPlaceholder')}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {t('hr.leave.cnasJustificationHelp')}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.submitting') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;
