import React, { useState, useEffect, useRef } from 'react';
import { PayrollCalculation } from '@/types/payroll';
import PayslipModal from '../components/PayslipModal';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import { hrService, Employee } from '@/services/hrService';
import { SMIG, CNAS_EMPLOYEE_RATE, CNAS_EMPLOYER_RATE } from '@/services/payrollService';

// Phase 1: Basic Payroll Calculator for Algerian regulations
export default function Payroll() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  // Form state - Phase 2
  const [formData, setFormData] = useState({
    // Basic information
    employeeId: '',
    baseSalary: SMIG, // Default to Algerian minimum wage
    workDays: 22, // Default working days in a month

    // Bonuses and allowances
    bonuses: 0, // Performance bonuses
    transportAllowance: 2500, // Transport allowance (common in Algeria)
    housingAllowance: 0, // Housing allowance

    // Deductions
    applyCNAS: true, // Apply CNAS deductions (9% employee, 26% employer)
    applyIRG: true, // Apply IRG (income tax)
    retirementFund: 0, // Additional retirement fund contribution
    professionalTax: 0, // Professional tax
    unionContribution: 0, // Union contribution
  });

  // Calculated values
  const [calculations, setCalculations] = useState<PayrollCalculation>({
    // Earnings
    baseSalary: 0,
    bonuses: 0,
    transportAllowance: 0,
    housingAllowance: 0,
    totalAllowances: 0,
    grossSalary: 0,

    // Deductions
    cnasEmployeeContribution: 0,
    retirementFund: 0,
    professionalTax: 0,
    unionContribution: 0,
    totalDeductionsBeforeTax: 0,
    taxableIncome: 0,
    irgTax: 0,
    totalDeductions: 0,
    netSalary: 0,

    // Employer costs
    cnasEmployerContribution: 0,
    totalEmployerCost: 0,
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculation state
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Payroll history state
  interface PayrollHistoryItem {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    baseSalary: number;
    grossSalary: number;
    netSalary: number;
  }

  const [payrollHistory, setPayrollHistory] = useState<PayrollHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Payslip modal state
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchEmployees();
    fetchPayrollHistory();
  }, []);

  // Auto-calculate when form data changes
  useEffect(() => {
    if (autoCalculate && formData.employeeId) {
      // Debounce the calculation to avoid too many updates
      const timer = setTimeout(() => {
        calculatePayroll(false); // Don't show success toast for auto-calculation
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formData]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await hrService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.payroll.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch payroll history
  const fetchPayrollHistory = async () => {
    try {
      setIsLoadingHistory(true);

      // In a real app, we would fetch from the API
      // const response = await api.get('/hr/payroll/history');
      // const data = response.data.data;

      // For now, we'll use mock data
      const mockHistory: PayrollHistoryItem[] = [
        {
          id: '1',
          employeeId: '1',
          employeeName: 'John Doe',
          date: new Date(2023, 6, 15).toISOString(),
          baseSalary: 45000,
          grossSalary: 52500,
          netSalary: 41895
        },
        {
          id: '2',
          employeeId: '2',
          employeeName: 'Jane Smith',
          date: new Date(2023, 6, 15).toISOString(),
          baseSalary: 60000,
          grossSalary: 69500,
          netSalary: 54405
        },
        {
          id: '3',
          employeeId: '1',
          employeeName: 'John Doe',
          date: new Date(2023, 5, 15).toISOString(),
          baseSalary: 45000,
          grossSalary: 51000,
          netSalary: 40590
        }
      ];

      setPayrollHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching payroll history:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.payroll.error.loadingHistory'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'baseSalary' || name === 'workDays' || name === 'bonuses'
        ? parseFloat(value) || 0
        : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If employee changes, update base salary
    if (name === 'employeeId') {
      const employee = employees.find(emp => emp._id === value);
      if (employee && employee.salary) {
        setFormData(prev => ({
          ...prev,
          baseSalary: employee.salary
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          baseSalary: SMIG // Default to minimum wage if no salary is set
        }));
      }
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check if employee is selected
    if (!formData.employeeId) {
      newErrors.employeeId = t('hr.payroll.error.selectEmployee');
    }

    // Validate base salary (must be at least SMIG)
    if (formData.baseSalary < SMIG) {
      newErrors.baseSalary = t('hr.payroll.error.minimumSalary', { minimum: SMIG });
    }

    // Validate work days (must be between 0 and 31)
    if (formData.workDays < 0 || formData.workDays > 31) {
      newErrors.workDays = t('hr.payroll.error.invalidWorkDays');
    }

    // Validate bonuses and allowances (must be non-negative)
    if (formData.bonuses < 0) {
      newErrors.bonuses = t('hr.payroll.error.negativeValue');
    }

    if (formData.transportAllowance < 0) {
      newErrors.transportAllowance = t('hr.payroll.error.negativeValue');
    }

    if (formData.housingAllowance < 0) {
      newErrors.housingAllowance = t('hr.payroll.error.negativeValue');
    }

    // Validate deductions (must be non-negative)
    if (formData.retirementFund < 0) {
      newErrors.retirementFund = t('hr.payroll.error.negativeValue');
    }

    if (formData.professionalTax < 0) {
      newErrors.professionalTax = t('hr.payroll.error.negativeValue');
    }

    if (formData.unionContribution < 0) {
      newErrors.unionContribution = t('hr.payroll.error.negativeValue');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate payroll
  const calculatePayroll = (showToast: boolean = true) => {
    // Skip validation for auto-calculation
    if (showToast && !validateForm()) {
      toast({
        title: t('common.error.title'),
        description: t('hr.payroll.error.validationFailed'),
        variant: 'destructive',
      });
      return;
    }

    setIsCalculating(true);

    try {
      // Calculate earnings
      const baseSalary = formData.baseSalary;
      const bonuses = formData.bonuses;
      const transportAllowance = formData.transportAllowance;
      const housingAllowance = formData.housingAllowance;

      // Calculate total allowances
      const totalAllowances = transportAllowance + housingAllowance;

      // Calculate gross salary (base salary + bonuses + allowances)
      const grossSalary = baseSalary + bonuses + totalAllowances;

      // Calculate CNAS employee contribution (9%)
      const cnasEmployeeContribution = formData.applyCNAS
        ? Math.round(grossSalary * CNAS_EMPLOYEE_RATE)
        : 0;

      // Calculate CNAS employer contribution (26%) - not deducted from employee salary
      const cnasEmployerContribution = formData.applyCNAS
        ? Math.round(grossSalary * CNAS_EMPLOYER_RATE)
        : 0;

      // Calculate other deductions
      const retirementFund = formData.retirementFund;
      const professionalTax = formData.professionalTax;
      const unionContribution = formData.unionContribution;

      // Calculate total deductions before tax
      const totalDeductionsBeforeTax = cnasEmployeeContribution + retirementFund + professionalTax + unionContribution;

      // Calculate taxable income (gross salary - deductions before tax)
      const taxableIncome = grossSalary - totalDeductionsBeforeTax;

      // Calculate IRG (income tax) using Algerian progressive tax algorithm
      let irgTax = 0;
      if (formData.applyIRG) {
        // 0% on first 30,000 DZD
        // No tax on this bracket

        // 20% on amount between 30,001 and 120,000 DZD
        if (taxableIncome > 30000) {
          const amountIn20Bracket = Math.min(taxableIncome, 120000) - 30000;
          irgTax += Math.round(amountIn20Bracket * 0.2);
        }

        // 30% on amount above 120,000 DZD
        if (taxableIncome > 120000) {
          const amountIn30Bracket = taxableIncome - 120000;
          irgTax += Math.round(amountIn30Bracket * 0.3);
        }
      }

      // Calculate total deductions
      const totalDeductions = totalDeductionsBeforeTax + irgTax;

      // Calculate net salary
      const netSalary = grossSalary - totalDeductions;

      // Calculate total employer cost
      const totalEmployerCost = grossSalary + cnasEmployerContribution;

      // Update calculations
      setCalculations({
        // Earnings
        baseSalary,
        bonuses,
        transportAllowance,
        housingAllowance,
        totalAllowances,
        grossSalary,

        // Deductions
        cnasEmployeeContribution,
        retirementFund,
        professionalTax,
        unionContribution,
        totalDeductionsBeforeTax,
        taxableIncome,
        irgTax,
        totalDeductions,
        netSalary,

        // Employer costs
        cnasEmployerContribution,
        totalEmployerCost,
      });

      // Only show success toast for manual calculation
      if (showToast) {
        toast({
          title: t('common.success'),
          description: t('hr.payroll.success.calculated'),
        });
      }

      // Save calculation to history (will be implemented in persistence step)
      if (showToast) {
        savePayrollToHistory();
      }
    } catch (error) {
      console.error('Error calculating payroll:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.payroll.error.calculating'),
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Save payroll calculation to history
  const savePayrollToHistory = async () => {
    if (!formData.employeeId) return;

    try {
      // Get employee details
      const employee = employees.find(emp => emp._id === formData.employeeId);
      if (!employee) return;

      // Create payroll history record
      const payrollRecord = {
        employeeId: formData.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        date: new Date().toISOString(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        baseSalary: calculations.baseSalary,
        grossSalary: calculations.grossSalary,
        netSalary: calculations.netSalary,
        deductions: {
          cnasEmployee: calculations.cnasEmployeeContribution,
          retirementFund: calculations.retirementFund,
          professionalTax: calculations.professionalTax,
          unionContribution: calculations.unionContribution,
          irg: calculations.irgTax,
          total: calculations.totalDeductions
        },
        employerContributions: {
          cnasEmployer: calculations.cnasEmployerContribution,
          total: calculations.totalEmployerCost
        }
      };

      // In a real app, we would save this to the backend
      // For now, we'll just log it to the console and update the local state
      console.log('Saving payroll to history:', payrollRecord);

      // Mock API call
      // await api.post('/hr/payroll/history', payrollRecord);

      // Add to local history
      const newHistoryItem: PayrollHistoryItem = {
        id: Date.now().toString(),
        employeeId: employee._id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        date: new Date().toISOString(),
        baseSalary: calculations.baseSalary,
        grossSalary: calculations.grossSalary,
        netSalary: calculations.netSalary
      };

      setPayrollHistory(prev => [newHistoryItem, ...prev]);

      // Show success message
      toast({
        title: t('hr.payroll.success.saved'),
        description: t('hr.payroll.success.savedDescription'),
      });
    } catch (error) {
      console.error('Error saving payroll to history:', error);
      toast({
        title: t('common.error.title'),
        description: t('hr.payroll.error.saving'),
        variant: 'destructive',
      });
    }
  };

  // Handle opening the payslip modal
  const handleOpenPayslipModal = () => {
    if (!formData.employeeId) {
      toast({
        title: t('common.error.title'),
        description: t('hr.payroll.error.selectEmployee'),
        variant: 'destructive',
      });
      return;
    }

    setIsPayslipModalOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('hr.payroll.title')}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('hr.payroll.calculator')}</CardTitle>
              <CardDescription>{t('hr.payroll.calculatorDescription')}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoCalculate"
                checked={autoCalculate}
                onCheckedChange={(checked) => setAutoCalculate(checked as boolean)}
              />
              <Label htmlFor="autoCalculate">
                {t('hr.payroll.autoCalculate')}
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employeeId">{t('hr.payroll.employee')}</Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => handleSelectChange('employeeId', value)}
            >
              <SelectTrigger className={errors.employeeId ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('hr.payroll.selectEmployee')} />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeId && (
              <p className="text-sm text-red-500">{errors.employeeId}</p>
            )}
          </div>

          {/* Base Salary */}
          <div className="space-y-2">
            <Label htmlFor="baseSalary">{t('hr.payroll.baseSalary')} (DZD)</Label>
            <Input
              id="baseSalary"
              name="baseSalary"
              type="number"
              value={formData.baseSalary}
              onChange={handleInputChange}
              min={SMIG}
              className={errors.baseSalary ? 'border-red-500' : ''}
            />
            {errors.baseSalary ? (
              <p className="text-sm text-red-500">{errors.baseSalary}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('hr.payroll.minimumWage')}: {formatCurrency(SMIG)}
              </p>
            )}
          </div>

          {/* Work Days */}
          <div className="space-y-2">
            <Label htmlFor="workDays">{t('hr.payroll.workDays')}</Label>
            <Input
              id="workDays"
              name="workDays"
              type="number"
              value={formData.workDays}
              onChange={handleInputChange}
              min={0}
              max={31}
              className={errors.workDays ? 'border-red-500' : ''}
            />
            {errors.workDays && (
              <p className="text-sm text-red-500">{errors.workDays}</p>
            )}
          </div>

          {/* Bonuses and Allowances */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-medium">{t('hr.payroll.bonusesAndAllowances')}</h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bonuses */}
              <div className="space-y-2">
                <Label htmlFor="bonuses">{t('hr.payroll.bonuses')} (DZD)</Label>
                <Input
                  id="bonuses"
                  name="bonuses"
                  type="number"
                  value={formData.bonuses}
                  onChange={handleInputChange}
                  min={0}
                  className={errors.bonuses ? 'border-red-500' : ''}
                />
                {errors.bonuses && (
                  <p className="text-sm text-red-500">{errors.bonuses}</p>
                )}
              </div>

              {/* Transport Allowance */}
              <div className="space-y-2">
                <Label htmlFor="transportAllowance">{t('hr.payroll.transportAllowance')} (DZD)</Label>
                <Input
                  id="transportAllowance"
                  name="transportAllowance"
                  type="number"
                  value={formData.transportAllowance}
                  onChange={handleInputChange}
                  min={0}
                  className={errors.transportAllowance ? 'border-red-500' : ''}
                />
                {errors.transportAllowance && (
                  <p className="text-sm text-red-500">{errors.transportAllowance}</p>
                )}
              </div>

              {/* Housing Allowance */}
              <div className="space-y-2">
                <Label htmlFor="housingAllowance">{t('hr.payroll.housingAllowance')} (DZD)</Label>
                <Input
                  id="housingAllowance"
                  name="housingAllowance"
                  type="number"
                  value={formData.housingAllowance}
                  onChange={handleInputChange}
                  min={0}
                  className={errors.housingAllowance ? 'border-red-500' : ''}
                />
                {errors.housingAllowance && (
                  <p className="text-sm text-red-500">{errors.housingAllowance}</p>
                )}
              </div>
            </div>
          </div>

          {/* Deductions Options */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-medium">{t('hr.payroll.deductions')}</h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mandatory Deductions */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="applyCNAS"
                    checked={formData.applyCNAS}
                    onCheckedChange={(checked) => handleCheckboxChange('applyCNAS', checked as boolean)}
                  />
                  <Label htmlFor="applyCNAS">
                    {t('hr.payroll.applyCNAS')} ({CNAS_EMPLOYEE_RATE * 100}%)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="applyIRG"
                    checked={formData.applyIRG}
                    onCheckedChange={(checked) => handleCheckboxChange('applyIRG', checked as boolean)}
                  />
                  <Label htmlFor="applyIRG">
                    {t('hr.payroll.applyIRG')}
                  </Label>
                </div>
              </div>

              {/* Additional Deductions */}
              <div className="space-y-2">
                <Label htmlFor="retirementFund">{t('hr.payroll.retirementFund')} (DZD)</Label>
                <Input
                  id="retirementFund"
                  name="retirementFund"
                  type="number"
                  value={formData.retirementFund}
                  onChange={handleInputChange}
                  min={0}
                  className={errors.retirementFund ? 'border-red-500' : ''}
                />
                {errors.retirementFund && (
                  <p className="text-sm text-red-500">{errors.retirementFund}</p>
                )}

                <Label htmlFor="professionalTax">{t('hr.payroll.professionalTax')} (DZD)</Label>
                <Input
                  id="professionalTax"
                  name="professionalTax"
                  type="number"
                  value={formData.professionalTax}
                  onChange={handleInputChange}
                  min={0}
                  className={errors.professionalTax ? 'border-red-500' : ''}
                />
                {errors.professionalTax && (
                  <p className="text-sm text-red-500">{errors.professionalTax}</p>
                )}

                <Label htmlFor="unionContribution">{t('hr.payroll.unionContribution')} (DZD)</Label>
                <Input
                  id="unionContribution"
                  name="unionContribution"
                  type="number"
                  value={formData.unionContribution}
                  onChange={handleInputChange}
                  min={0}
                  className={errors.unionContribution ? 'border-red-500' : ''}
                />
                {errors.unionContribution && (
                  <p className="text-sm text-red-500">{errors.unionContribution}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => {
            setFormData({
              // Basic information
              employeeId: '',
              baseSalary: SMIG,
              workDays: 22,

              // Bonuses and allowances
              bonuses: 0,
              transportAllowance: 2500,
              housingAllowance: 0,

              // Deductions
              applyCNAS: true,
              applyIRG: true,
              retirementFund: 0,
              professionalTax: 0,
              unionContribution: 0,
            });
            setCalculations({
              // Earnings
              baseSalary: 0,
              bonuses: 0,
              transportAllowance: 0,
              housingAllowance: 0,
              totalAllowances: 0,
              grossSalary: 0,

              // Deductions
              cnasEmployeeContribution: 0,
              retirementFund: 0,
              professionalTax: 0,
              unionContribution: 0,
              totalDeductionsBeforeTax: 0,
              taxableIncome: 0,
              irgTax: 0,
              totalDeductions: 0,
              netSalary: 0,

              // Employer costs
              cnasEmployerContribution: 0,
              totalEmployerCost: 0,
            });
          }}>
            {t('common.reset')}
          </Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoCalculateFooter"
                checked={autoCalculate}
                onCheckedChange={(checked) => setAutoCalculate(checked as boolean)}
              />
              <Label htmlFor="autoCalculateFooter" className="text-sm">
                {t('hr.payroll.autoCalculate')}
              </Label>
            </div>
          </div>
          <Button onClick={() => calculatePayroll(true)} disabled={isCalculating}>
            {isCalculating ? t('common.calculating') : t('hr.payroll.calculate')}
          </Button>
        </CardFooter>
      </Card>

      {/* Payroll History Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('hr.payroll.history.title')}</CardTitle>
          <CardDescription>{t('hr.payroll.history.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="flex justify-center py-4">
              <p>{t('common.loading')}</p>
            </div>
          ) : payrollHistory.length === 0 ? (
            <div className="text-center py-4">
              <p>{t('hr.payroll.history.empty')}</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <Table>
                <TableCaption>{t('hr.payroll.history.caption')}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('hr.payroll.employee')}</TableHead>
                    <TableHead>{t('hr.payroll.date')}</TableHead>
                    <TableHead className="text-right">{t('hr.payroll.baseSalary')}</TableHead>
                    <TableHead className="text-right">{t('hr.payroll.grossSalary')}</TableHead>
                    <TableHead className="text-right">{t('hr.payroll.netSalary')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.employeeName}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.baseSalary)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.grossSalary)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.netSalary)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Results Card */}
      {calculations.grossSalary > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('hr.payroll.results')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">{t('hr.payroll.grossSalary')}</h3>
                <p className="text-2xl font-bold">{formatCurrency(calculations.grossSalary)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">{t('hr.payroll.netSalary')}</h3>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(calculations.netSalary)}</p>
              </div>
            </div>

            <Separator />

            {/* Earnings Breakdown */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('hr.payroll.earnings')}</h3>

              <div className="flex justify-between">
                <span>{t('hr.payroll.baseSalary')}</span>
                <span className="font-medium">{formatCurrency(calculations.baseSalary)}</span>
              </div>

              {calculations.bonuses > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.bonuses')}</span>
                  <span className="font-medium">{formatCurrency(calculations.bonuses)}</span>
                </div>
              )}

              {calculations.transportAllowance > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.transportAllowance')}</span>
                  <span className="font-medium">{formatCurrency(calculations.transportAllowance)}</span>
                </div>
              )}

              {calculations.housingAllowance > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.housingAllowance')}</span>
                  <span className="font-medium">{formatCurrency(calculations.housingAllowance)}</span>
                </div>
              )}

              {calculations.totalAllowances > 0 && (
                <div className="flex justify-between font-medium">
                  <span>{t('hr.payroll.totalAllowances')}</span>
                  <span>{formatCurrency(calculations.totalAllowances)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium pt-2">
                <span>{t('hr.payroll.grossSalary')}</span>
                <span>{formatCurrency(calculations.grossSalary)}</span>
              </div>
            </div>

            <Separator />

            {/* Deductions Breakdown */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('hr.payroll.deductions')}</h3>

              {calculations.cnasEmployeeContribution > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.cnasEmployeeContribution')} ({CNAS_EMPLOYEE_RATE * 100}%)</span>
                  <span className="font-medium text-red-500">-{formatCurrency(calculations.cnasEmployeeContribution)}</span>
                </div>
              )}

              {calculations.retirementFund > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.retirementFund')}</span>
                  <span className="font-medium text-red-500">-{formatCurrency(calculations.retirementFund)}</span>
                </div>
              )}

              {calculations.professionalTax > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.professionalTax')}</span>
                  <span className="font-medium text-red-500">-{formatCurrency(calculations.professionalTax)}</span>
                </div>
              )}

              {calculations.unionContribution > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.unionContribution')}</span>
                  <span className="font-medium text-red-500">-{formatCurrency(calculations.unionContribution)}</span>
                </div>
              )}

              {calculations.totalDeductionsBeforeTax > 0 && (
                <div className="flex justify-between font-medium">
                  <span>{t('hr.payroll.totalDeductionsBeforeTax')}</span>
                  <span className="text-red-500">-{formatCurrency(calculations.totalDeductionsBeforeTax)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <span>{t('hr.payroll.taxableIncome')}</span>
                <span className="font-medium">{formatCurrency(calculations.taxableIncome)}</span>
              </div>

              {calculations.irgTax > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.irgTax')}</span>
                  <span className="font-medium text-red-500">-{formatCurrency(calculations.irgTax)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium pt-2">
                <span>{t('hr.payroll.totalDeductions')}</span>
                <span className="text-red-500">-{formatCurrency(calculations.totalDeductions)}</span>
              </div>

              <div className="flex justify-between font-medium pt-2">
                <span>{t('hr.payroll.netSalary')}</span>
                <span className="text-green-600">{formatCurrency(calculations.netSalary)}</span>
              </div>
            </div>

            <Separator />

            {/* Employer Costs */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('hr.payroll.employerContributions')}</h3>

              <div className="flex justify-between">
                <span>{t('hr.payroll.baseSalary')}</span>
                <span className="font-medium">{formatCurrency(calculations.baseSalary)}</span>
              </div>

              {calculations.totalAllowances > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.totalAllowances')}</span>
                  <span className="font-medium">{formatCurrency(calculations.totalAllowances)}</span>
                </div>
              )}

              {calculations.bonuses > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.bonuses')}</span>
                  <span className="font-medium">{formatCurrency(calculations.bonuses)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t('hr.payroll.grossSalary')}</span>
                <span className="font-medium">{formatCurrency(calculations.grossSalary)}</span>
              </div>

              {calculations.cnasEmployerContribution > 0 && (
                <div className="flex justify-between">
                  <span>{t('hr.payroll.cnasEmployerContribution')} ({CNAS_EMPLOYER_RATE * 100}%)</span>
                  <span className="font-medium">{formatCurrency(calculations.cnasEmployerContribution)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium pt-2">
                <span>{t('hr.payroll.totalEmployerCost')}</span>
                <span>{formatCurrency(calculations.totalEmployerCost)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleOpenPayslipModal}>
              {t('hr.payroll.generatePayslip')}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>

    {/* Payslip Modal */}
    <PayslipModal
      isOpen={isPayslipModalOpen}
      onClose={() => setIsPayslipModalOpen(false)}
      employee={employees.find(emp => emp._id === formData.employeeId) || null}
      calculations={calculations}
      month={selectedMonth}
      year={selectedYear}
    />
  );
}