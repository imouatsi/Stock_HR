import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { hrService, Employee, ContractType, FamilySituation } from '@/services/hrService';

const Employees: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Basic information
    firstName: '',
    lastName: '',
    phoneNumber: '',
    department: '',
    position: '',
    status: 'ACTIVE' as const,
    salary: 0,

    // Algerian-specific fields
    cnasNumber: '',
    nationalRegistryNumber: '',
    dateOfBirth: undefined as Date | undefined,
    familySituation: FamilySituation.SINGLE,
    contractType: ContractType.CDI,
    contractStartDate: new Date(),
    contractEndDate: undefined as Date | undefined,
    probationPeriodEndDate: undefined as Date | undefined,
    cnasAffiliationStatus: true,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await hrService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('hr.employees.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      // Basic information
      firstName: '',
      lastName: '',
      phoneNumber: '',
      department: '',
      position: '',
      status: 'ACTIVE',
      salary: 0,

      // Algerian-specific fields
      cnasNumber: '',
      nationalRegistryNumber: '',
      dateOfBirth: undefined,
      familySituation: FamilySituation.SINGLE,
      contractType: ContractType.CDI,
      contractStartDate: new Date(),
      contractEndDate: undefined,
      probationPeriodEndDate: undefined,
      cnasAffiliationStatus: true,
    });
  };

  // Open dialog
  const handleAddEmployee = () => {
    setIsDialogOpen(true);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
        toast({
          title: t('common.error.title'),
          description: t('hr.employees.error.requiredFields'),
          variant: 'destructive',
        });
        return;
      }

      // Validate Algerian-specific fields
      if (formData.contractType === ContractType.CDD && !formData.contractEndDate) {
        toast({
          title: t('common.error.title'),
          description: t('hr.employees.error.contractEndDateRequired'),
          variant: 'destructive',
        });
        return;
      }

      // Create employee with Algerian-specific fields
      const newEmployee = await hrService.createEmployee({
        ...formData,
        phone: formData.phoneNumber, // Map phoneNumber to phone for API
        hireDate: formData.contractStartDate.toISOString(),
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : undefined,
        contractEndDate: formData.contractEndDate ? formData.contractEndDate.toISOString() : undefined,
        probationPeriodEndDate: formData.probationPeriodEndDate ? formData.probationPeriodEndDate.toISOString() : undefined,
      });

      // Update employees list
      setEmployees(prev => [newEmployee, ...prev]);

      // Show success message
      toast({
        title: t('common.success'),
        description: t('hr.employees.success.created'),
      });

      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.employees.error.creating'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('hr.employees.title')}</h1>
        <Button onClick={handleAddEmployee}>
          {t('hr.employees.addEmployee')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('hr.employees.firstName')}</TableHead>
              <TableHead>{t('hr.employees.lastName')}</TableHead>
              <TableHead>{t('hr.employees.phoneNumber')}</TableHead>
              <TableHead>{t('hr.employees.department')}</TableHead>
              <TableHead>{t('hr.employees.position')}</TableHead>
              <TableHead>{t('hr.employees.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!employees || employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              employees?.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee?.firstName}</TableCell>
                  <TableCell>{employee?.lastName}</TableCell>
                  <TableCell>{employee?.phoneNumber}</TableCell>
                  <TableCell>{employee?.department}</TableCell>
                  <TableCell>{employee?.position}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        employee?.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {employee?.status === 'ACTIVE' ? t('hr.employees.status.active') : t('hr.employees.status.inactive')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast({
                          title: t('common.notImplemented'),
                          description: t('common.featureComingSoon'),
                        });
                      }}
                    >
                      {t('common.edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('hr.employees.addEmployee')}</DialogTitle>
            <DialogDescription>
              {t('hr.employees.addEmployeeDescription')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">{t('hr.employees.tabs.basicInfo')}</TabsTrigger>
                <TabsTrigger value="algerian">{t('hr.employees.tabs.algerianInfo')}</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('hr.employees.firstName')}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('hr.employees.lastName')}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t('hr.employees.phoneNumber')}</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">{t('hr.employees.department')}</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleSelectChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('hr.employees.selectDepartment')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">{t('hr.employees.position')}</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => handleSelectChange('position', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('hr.employees.selectPosition')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Developer">Developer</SelectItem>
                        <SelectItem value="Designer">Designer</SelectItem>
                        <SelectItem value="Accountant">Accountant</SelectItem>
                        <SelectItem value="HR Manager">HR Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('hr.employees.status')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('hr.employees.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">{t('hr.employees.status.active')}</SelectItem>
                        <SelectItem value="INACTIVE">{t('hr.employees.status.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">{t('hr.employees.salary')}</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Algerian-Specific Information Tab */}
              <TabsContent value="algerian" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnasNumber">{t('hr.employees.cnasNumber')}</Label>
                    <Input
                      id="cnasNumber"
                      name="cnasNumber"
                      value={formData.cnasNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationalRegistryNumber">{t('hr.employees.nationalRegistryNumber')}</Label>
                    <Input
                      id="nationalRegistryNumber"
                      name="nationalRegistryNumber"
                      value={formData.nationalRegistryNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('hr.employees.dateOfBirth')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dateOfBirth ? format(formData.dateOfBirth, 'PPP') : <span>{t('hr.employees.selectDate')}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dateOfBirth}
                          onSelect={(date) => handleDateChange('dateOfBirth', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familySituation">{t('hr.employees.familySituation')}</Label>
                    <Select
                      value={formData.familySituation}
                      onValueChange={(value) => handleSelectChange('familySituation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('hr.employees.selectFamilySituation')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={FamilySituation.SINGLE}>{t('hr.employees.familySituation.single')}</SelectItem>
                        <SelectItem value={FamilySituation.MARRIED}>{t('hr.employees.familySituation.married')}</SelectItem>
                        <SelectItem value={FamilySituation.DIVORCED}>{t('hr.employees.familySituation.divorced')}</SelectItem>
                        <SelectItem value={FamilySituation.WIDOWED}>{t('hr.employees.familySituation.widowed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractType">{t('hr.employees.contractType')}</Label>
                  <Select
                    value={formData.contractType}
                    onValueChange={(value) => handleSelectChange('contractType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('hr.employees.selectContractType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ContractType.CDI}>{t('hr.employees.contractType.cdi')}</SelectItem>
                      <SelectItem value={ContractType.CDD}>{t('hr.employees.contractType.cdd')}</SelectItem>
                      <SelectItem value={ContractType.STAGE}>{t('hr.employees.contractType.stage')}</SelectItem>
                      <SelectItem value={ContractType.INTERIM}>{t('hr.employees.contractType.interim')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('hr.employees.contractStartDate')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.contractStartDate ? format(formData.contractStartDate, 'PPP') : <span>{t('hr.employees.selectDate')}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.contractStartDate}
                          onSelect={(date) => handleDateChange('contractStartDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {formData.contractType === ContractType.CDD && (
                    <div className="space-y-2">
                      <Label>{t('hr.employees.contractEndDate')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.contractEndDate ? format(formData.contractEndDate, 'PPP') : <span>{t('hr.employees.selectDate')}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.contractEndDate}
                            onSelect={(date) => handleDateChange('contractEndDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('hr.employees.probationPeriodEndDate')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.probationPeriodEndDate ? format(formData.probationPeriodEndDate, 'PPP') : <span>{t('hr.employees.selectDate')}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.probationPeriodEndDate}
                          onSelect={(date) => handleDateChange('probationPeriodEndDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="cnasAffiliationStatus"
                      checked={formData.cnasAffiliationStatus}
                      onCheckedChange={(checked) => handleCheckboxChange('cnasAffiliationStatus', checked as boolean)}
                    />
                    <Label htmlFor="cnasAffiliationStatus">{t('hr.employees.cnasAffiliationStatus')}</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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

export default Employees;