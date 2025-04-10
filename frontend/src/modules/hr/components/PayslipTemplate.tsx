import React, { forwardRef } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Employee } from '@/services/hrService';
import { PayrollCalculation } from '@/types/payroll';
import { useTranslation } from 'react-i18next';
import { CNAS_EMPLOYEE_RATE, CNAS_EMPLOYER_RATE } from '@/services/payrollService';

interface PayslipTemplateProps {
  employee: Employee;
  calculations: PayrollCalculation;
  month: number;
  year: number;
  companyName?: string;
  companyAddress?: string;
  companyLogo?: string;
  paymentDate?: string;
  paymentMethod?: string;
  reference?: string;
}

const PayslipTemplate = forwardRef<HTMLDivElement, PayslipTemplateProps>(
  (
    {
      employee,
      calculations,
      month,
      year,
      companyName = '404 ENTERPRISE',
      companyAddress = 'Algiers, Algeria',
      companyLogo,
      paymentDate = new Date().toISOString().split('T')[0],
      paymentMethod = 'Bank Transfer',
      reference = `PAY-${year}-${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    },
    ref
  ) => {
    const { t } = useTranslation();
    
    // Format date
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('fr-DZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };
    
    // Get month name
    const getMonthName = (monthNumber: number) => {
      return new Date(2000, monthNumber - 1, 1).toLocaleDateString('fr-DZ', { month: 'long' });
    };
    
    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto shadow-lg print:shadow-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="h-16 mb-2" />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">{companyName}</h1>
            )}
            <p className="text-gray-600">{companyAddress}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">{t('hr.payroll.payslipTitle')}</h2>
            <p className="text-gray-600">
              {getMonthName(month)} {year}
            </p>
            <p className="text-gray-600">{t('hr.payroll.reference')}: {reference}</p>
          </div>
        </div>
        
        {/* Employee Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('hr.payroll.employeeDetails')}</h3>
            <div className="space-y-1">
              <p>
                <span className="font-medium">{t('hr.employees.name')}:</span> {employee.firstName} {employee.lastName}
              </p>
              <p>
                <span className="font-medium">{t('hr.employees.employeeId')}:</span> {employee.employeeId || employee._id}
              </p>
              {employee.position && (
                <p>
                  <span className="font-medium">{t('hr.payroll.position')}:</span> {employee.position}
                </p>
              )}
              {employee.department && (
                <p>
                  <span className="font-medium">{t('hr.payroll.department')}:</span> {employee.department}
                </p>
              )}
              {employee.cnasNumber && (
                <p>
                  <span className="font-medium">{t('hr.payroll.cnasNumber')}:</span> {employee.cnasNumber}
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('hr.payroll.paymentDetails')}</h3>
            <div className="space-y-1">
              <p>
                <span className="font-medium">{t('hr.payroll.paymentDate')}:</span> {formatDate(paymentDate)}
              </p>
              <p>
                <span className="font-medium">{t('hr.payroll.paymentMethod')}:</span> {paymentMethod}
              </p>
              <p>
                <span className="font-medium">{t('hr.payroll.period')}:</span> {getMonthName(month)} {year}
              </p>
            </div>
          </div>
        </div>
        
        {/* Earnings and Deductions */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('hr.payroll.earnings')}</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">{t('hr.payroll.description')}</th>
                  <th className="text-right py-2">{t('hr.payroll.amount')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">{t('hr.payroll.baseSalary')}</td>
                  <td className="text-right py-2">{formatCurrency(calculations.baseSalary)}</td>
                </tr>
                {calculations.bonuses > 0 && (
                  <tr className="border-b">
                    <td className="py-2">{t('hr.payroll.bonuses')}</td>
                    <td className="text-right py-2">{formatCurrency(calculations.bonuses)}</td>
                  </tr>
                )}
                {calculations.transportAllowance > 0 && (
                  <tr className="border-b">
                    <td className="py-2">{t('hr.payroll.transportAllowance')}</td>
                    <td className="text-right py-2">{formatCurrency(calculations.transportAllowance)}</td>
                  </tr>
                )}
                {calculations.housingAllowance > 0 && (
                  <tr className="border-b">
                    <td className="py-2">{t('hr.payroll.housingAllowance')}</td>
                    <td className="text-right py-2">{formatCurrency(calculations.housingAllowance)}</td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-2">{t('hr.payroll.grossSalary')}</td>
                  <td className="text-right py-2">{formatCurrency(calculations.grossSalary)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Deductions */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('hr.payroll.deductions')}</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">{t('hr.payroll.description')}</th>
                  <th className="text-right py-2">{t('hr.payroll.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {calculations.cnasEmployeeContribution > 0 && (
                  <tr className="border-b">
                    <td className="py-2">
                      {t('hr.payroll.cnasEmployeeContribution')} ({CNAS_EMPLOYEE_RATE * 100}%)
                    </td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculations.cnasEmployeeContribution)}
                    </td>
                  </tr>
                )}
                {calculations.retirementFund > 0 && (
                  <tr className="border-b">
                    <td className="py-2">{t('hr.payroll.retirementFund')}</td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculations.retirementFund)}
                    </td>
                  </tr>
                )}
                {calculations.professionalTax > 0 && (
                  <tr className="border-b">
                    <td className="py-2">{t('hr.payroll.professionalTax')}</td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculations.professionalTax)}
                    </td>
                  </tr>
                )}
                {calculations.unionContribution > 0 && (
                  <tr className="border-b">
                    <td className="py-2">{t('hr.payroll.unionContribution')}</td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculations.unionContribution)}
                    </td>
                  </tr>
                )}
                {calculations.irgTax > 0 && (
                  <tr className="border-b">
                    <td className="py-2">{t('hr.payroll.irgTax')}</td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculations.irgTax)}
                    </td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-2">{t('hr.payroll.totalDeductions')}</td>
                  <td className="text-right py-2 text-red-600">
                    -{formatCurrency(calculations.totalDeductions)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Summary */}
        <div className="bg-gray-100 p-4 rounded-md mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('hr.payroll.summary')}</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1">{t('hr.payroll.grossSalary')}</td>
                    <td className="text-right py-1">{formatCurrency(calculations.grossSalary)}</td>
                  </tr>
                  <tr>
                    <td className="py-1">{t('hr.payroll.totalDeductions')}</td>
                    <td className="text-right py-1 text-red-600">
                      -{formatCurrency(calculations.totalDeductions)}
                    </td>
                  </tr>
                  <tr className="font-bold text-lg">
                    <td className="py-1">{t('hr.payroll.netSalary')}</td>
                    <td className="text-right py-1 text-green-600">
                      {formatCurrency(calculations.netSalary)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('hr.payroll.employerContributions')}</h3>
              <table className="w-full">
                <tbody>
                  {calculations.cnasEmployerContribution > 0 && (
                    <tr>
                      <td className="py-1">
                        {t('hr.payroll.cnasEmployerContribution')} ({CNAS_EMPLOYER_RATE * 100}%)
                      </td>
                      <td className="text-right py-1">{formatCurrency(calculations.cnasEmployerContribution)}</td>
                    </tr>
                  )}
                  <tr className="font-semibold">
                    <td className="py-1">{t('hr.payroll.totalEmployerCost')}</td>
                    <td className="text-right py-1">{formatCurrency(calculations.totalEmployerCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-8 pt-4 border-t">
          <p>{t('hr.payroll.payslipFooter')}</p>
          <p className="mt-2">
            {companyName} - {companyAddress}
          </p>
        </div>
      </div>
    );
  }
);

PayslipTemplate.displayName = 'PayslipTemplate';

export default PayslipTemplate;
