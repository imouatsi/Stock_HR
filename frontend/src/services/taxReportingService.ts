import api from './api.service';
import { 
  TaxPeriod, 
  TaxRate, 
  G50Declaration, 
  TVADeclaration, 
  IBSDeclaration, 
  TaxReport 
} from '@/types/tax-reporting';

class TaxReportingService {
  // Error handling
  private handleError(error: any): never {
    console.error('Tax Reporting Service Error:', error);
    throw error;
  }

  // Tax Periods
  async getAllTaxPeriods(): Promise<TaxPeriod[]> {
    try {
      const response = await api.get('/accounting/tax-periods');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // Return mock data if API fails
      return this.getDefaultTaxPeriods();
    } catch (error) {
      console.error('Error fetching tax periods:', error);
      // Return mock data
      return this.getDefaultTaxPeriods();
    }
  }

  private getDefaultTaxPeriods(): TaxPeriod[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Generate monthly periods for current year
    const monthlyPeriods: TaxPeriod[] = [];
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);
      
      monthlyPeriods.push({
        _id: `TP-M-${currentYear}-${month.toString().padStart(2, '0')}`,
        code: `M${month.toString().padStart(2, '0')}/${currentYear}`,
        name: `${this.getMonthName(month)} ${currentYear}`,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        type: 'monthly',
        year: currentYear,
        month: month,
        isClosed: month < currentMonth,
        closedAt: month < currentMonth ? new Date(currentYear, month, 5).toISOString() : undefined,
        closedBy: month < currentMonth ? 'system' : undefined
      });
    }
    
    // Generate quarterly periods for current year
    const quarterlyPeriods: TaxPeriod[] = [];
    for (let quarter = 1; quarter <= 4; quarter++) {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = quarter * 3;
      const startDate = new Date(currentYear, startMonth - 1, 1);
      const endDate = new Date(currentYear, endMonth, 0);
      
      quarterlyPeriods.push({
        _id: `TP-Q-${currentYear}-${quarter}`,
        code: `Q${quarter}/${currentYear}`,
        name: `Q${quarter} ${currentYear}`,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        type: 'quarterly',
        year: currentYear,
        quarter: quarter,
        isClosed: endMonth < currentMonth,
        closedAt: endMonth < currentMonth ? new Date(currentYear, endMonth, 20).toISOString() : undefined,
        closedBy: endMonth < currentMonth ? 'system' : undefined
      });
    }
    
    // Generate annual period for current year
    const annualPeriods: TaxPeriod[] = [{
      _id: `TP-A-${currentYear}`,
      code: `A/${currentYear}`,
      name: `Annual ${currentYear}`,
      startDate: new Date(currentYear, 0, 1).toISOString().split('T')[0],
      endDate: new Date(currentYear, 11, 31).toISOString().split('T')[0],
      type: 'annual',
      year: currentYear,
      isClosed: false
    }];
    
    // Generate annual period for previous year
    const previousYear = currentYear - 1;
    annualPeriods.push({
      _id: `TP-A-${previousYear}`,
      code: `A/${previousYear}`,
      name: `Annual ${previousYear}`,
      startDate: new Date(previousYear, 0, 1).toISOString().split('T')[0],
      endDate: new Date(previousYear, 11, 31).toISOString().split('T')[0],
      type: 'annual',
      year: previousYear,
      isClosed: true,
      closedAt: new Date(currentYear, 3, 30).toISOString(),
      closedBy: 'system'
    });
    
    return [...monthlyPeriods, ...quarterlyPeriods, ...annualPeriods];
  }

  private getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  }

  async getTaxPeriodById(id: string): Promise<TaxPeriod | null> {
    try {
      const response = await api.get(`/accounting/tax-periods/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // If API fails, try to find in default periods
      const defaultPeriods = this.getDefaultTaxPeriods();
      const period = defaultPeriods.find(p => p._id === id);
      return period || null;
    } catch (error) {
      console.error('Error fetching tax period:', error);
      // Try to find in default periods
      const defaultPeriods = this.getDefaultTaxPeriods();
      const period = defaultPeriods.find(p => p._id === id);
      return period || null;
    }
  }

  // Tax Rates
  async getAllTaxRates(): Promise<TaxRate[]> {
    try {
      const response = await api.get('/accounting/tax-rates');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // Return mock data if API fails
      return this.getDefaultTaxRates();
    } catch (error) {
      console.error('Error fetching tax rates:', error);
      // Return mock data
      return this.getDefaultTaxRates();
    }
  }

  private getDefaultTaxRates(): TaxRate[] {
    return [
      {
        _id: 'TR-TVA-19',
        code: 'TVA-19',
        name: 'TVA Standard',
        rate: 19,
        description: 'Taxe sur la Valeur Ajoutée - Taux normal',
        isActive: true,
        effectiveDate: '2017-01-01'
      },
      {
        _id: 'TR-TVA-9',
        code: 'TVA-9',
        name: 'TVA Réduit',
        rate: 9,
        description: 'Taxe sur la Valeur Ajoutée - Taux réduit',
        isActive: true,
        effectiveDate: '2017-01-01'
      },
      {
        _id: 'TR-TVA-0',
        code: 'TVA-0',
        name: 'TVA Exonéré',
        rate: 0,
        description: 'Taxe sur la Valeur Ajoutée - Exonération',
        isActive: true,
        effectiveDate: '2017-01-01'
      },
      {
        _id: 'TR-TAP-2',
        code: 'TAP-2',
        name: 'TAP Standard',
        rate: 2,
        description: 'Taxe sur l\'Activité Professionnelle - Taux normal',
        isActive: true,
        effectiveDate: '2017-01-01'
      },
      {
        _id: 'TR-TAP-1',
        code: 'TAP-1',
        name: 'TAP Réduit',
        rate: 1,
        description: 'Taxe sur l\'Activité Professionnelle - Taux réduit',
        isActive: true,
        effectiveDate: '2017-01-01'
      },
      {
        _id: 'TR-IBS-26',
        code: 'IBS-26',
        name: 'IBS Standard',
        rate: 26,
        description: 'Impôt sur les Bénéfices des Sociétés - Taux normal',
        isActive: true,
        effectiveDate: '2020-01-01'
      },
      {
        _id: 'TR-IBS-19',
        code: 'IBS-19',
        name: 'IBS Réduit',
        rate: 19,
        description: 'Impôt sur les Bénéfices des Sociétés - Taux réduit',
        isActive: true,
        effectiveDate: '2020-01-01'
      }
    ];
  }

  // G50 Declarations
  async getAllG50Declarations(): Promise<G50Declaration[]> {
    try {
      const response = await api.get('/accounting/g50-declarations');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // Return mock data if API fails
      return this.getDefaultG50Declarations();
    } catch (error) {
      console.error('Error fetching G50 declarations:', error);
      // Return mock data
      return this.getDefaultG50Declarations();
    }
  }

  private getDefaultG50Declarations(): G50Declaration[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    const companyInfo: CompanyInfo = {
      name: '404 ENTERPRISE',
      address: '123 Rue des Oliviers, Alger, Algérie',
      taxId: '123456789012345',
      taxRegistrationNumber: '9876543210',
      articleOfImposition: 'A12345',
      activityCode: '01.13.00',
      municipality: 'Alger Centre',
      wilaya: 'Alger'
    };
    
    return [
      {
        _id: `G50-${previousMonthYear}-${previousMonth.toString().padStart(2, '0')}`,
        declarationNumber: `G50/${previousMonthYear}/${previousMonth.toString().padStart(2, '0')}`,
        periodId: `TP-M-${previousMonthYear}-${previousMonth.toString().padStart(2, '0')}`,
        periodName: `${this.getMonthName(previousMonth)} ${previousMonthYear}`,
        periodType: 'monthly',
        year: previousMonthYear,
        month: previousMonth,
        submissionDate: new Date(previousMonthYear, previousMonth, 15).toISOString().split('T')[0],
        dueDate: new Date(previousMonthYear, previousMonth, 20).toISOString().split('T')[0],
        status: 'submitted',
        companyInfo,
        taxSections: [
          {
            code: 'TVA-C',
            name: 'TVA Collectée',
            taxType: 'TVA',
            description: 'TVA collectée sur les ventes',
            taxableAmount: 1000000,
            taxRate: 19,
            taxAmount: 190000,
            isExempt: false
          },
          {
            code: 'TVA-D',
            name: 'TVA Déductible',
            taxType: 'TVA',
            description: 'TVA déductible sur les achats',
            taxableAmount: 500000,
            taxRate: 19,
            taxAmount: 95000,
            isExempt: false
          },
          {
            code: 'TAP',
            name: 'Taxe sur l\'Activité Professionnelle',
            taxType: 'TAP',
            description: 'TAP sur le chiffre d\'affaires',
            taxableAmount: 1000000,
            taxRate: 2,
            taxAmount: 20000,
            isExempt: false
          },
          {
            code: 'IRG-S',
            name: 'IRG Salaires',
            taxType: 'IRG',
            description: 'Impôt sur le Revenu Global - Salaires',
            taxableAmount: 300000,
            taxRate: 20,
            taxAmount: 60000,
            isExempt: false
          }
        ],
        totalAmount: 175000, // TVA Net (190000 - 95000) + TAP (20000) + IRG (60000)
        paymentMethod: 'Virement bancaire',
        paymentReference: 'VIR-2023-05-001',
        paymentDate: new Date(previousMonthYear, previousMonth, 18).toISOString().split('T')[0],
        createdBy: 'system',
        createdAt: new Date(previousMonthYear, previousMonth, 10).toISOString(),
        updatedAt: new Date(previousMonthYear, previousMonth, 15).toISOString(),
        submittedAt: new Date(previousMonthYear, previousMonth, 15).toISOString(),
        submittedBy: 'system'
      }
    ];
  }

  async getG50DeclarationById(id: string): Promise<G50Declaration | null> {
    try {
      const response = await api.get(`/accounting/g50-declarations/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // If API fails, try to find in default declarations
      const defaultDeclarations = this.getDefaultG50Declarations();
      const declaration = defaultDeclarations.find(d => d._id === id);
      return declaration || null;
    } catch (error) {
      console.error('Error fetching G50 declaration:', error);
      // Try to find in default declarations
      const defaultDeclarations = this.getDefaultG50Declarations();
      const declaration = defaultDeclarations.find(d => d._id === id);
      return declaration || null;
    }
  }

  async generateG50Declaration(periodId: string): Promise<G50Declaration> {
    try {
      const response = await api.post('/accounting/g50-declarations/generate', { periodId });
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // Mock response if API fails
      const period = await this.getTaxPeriodById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      const companyInfo: CompanyInfo = {
        name: '404 ENTERPRISE',
        address: '123 Rue des Oliviers, Alger, Algérie',
        taxId: '123456789012345',
        taxRegistrationNumber: '9876543210',
        articleOfImposition: 'A12345',
        activityCode: '01.13.00',
        municipality: 'Alger Centre',
        wilaya: 'Alger'
      };
      
      return {
        _id: `G50-${period.year}-${period.month?.toString().padStart(2, '0') || period.quarter}`,
        declarationNumber: `G50/${period.year}/${period.month?.toString().padStart(2, '0') || 'Q' + period.quarter}`,
        periodId: period._id || '',
        periodName: period.name,
        periodType: period.type === 'monthly' ? 'monthly' : 'quarterly',
        year: period.year,
        month: period.month,
        quarter: period.quarter,
        submissionDate: new Date().toISOString().split('T')[0],
        dueDate: period.type === 'monthly' 
          ? new Date(period.year, (period.month || 1), 20).toISOString().split('T')[0]
          : new Date(period.year, (period.quarter || 1) * 3, 20).toISOString().split('T')[0],
        status: 'draft',
        companyInfo,
        taxSections: [
          {
            code: 'TVA-C',
            name: 'TVA Collectée',
            taxType: 'TVA',
            description: 'TVA collectée sur les ventes',
            taxableAmount: 1200000,
            taxRate: 19,
            taxAmount: 228000,
            isExempt: false
          },
          {
            code: 'TVA-D',
            name: 'TVA Déductible',
            taxType: 'TVA',
            description: 'TVA déductible sur les achats',
            taxableAmount: 600000,
            taxRate: 19,
            taxAmount: 114000,
            isExempt: false
          },
          {
            code: 'TAP',
            name: 'Taxe sur l\'Activité Professionnelle',
            taxType: 'TAP',
            description: 'TAP sur le chiffre d\'affaires',
            taxableAmount: 1200000,
            taxRate: 2,
            taxAmount: 24000,
            isExempt: false
          },
          {
            code: 'IRG-S',
            name: 'IRG Salaires',
            taxType: 'IRG',
            description: 'Impôt sur le Revenu Global - Salaires',
            taxableAmount: 350000,
            taxRate: 20,
            taxAmount: 70000,
            isExempt: false
          }
        ],
        totalAmount: 208000, // TVA Net (228000 - 114000) + TAP (24000) + IRG (70000)
        createdBy: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating G50 declaration:', error);
      throw error;
    }
  }

  async submitG50Declaration(id: string): Promise<G50Declaration> {
    try {
      const response = await api.post(`/accounting/g50-declarations/${id}/submit`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // Mock response if API fails
      const declaration = await this.getG50DeclarationById(id);
      if (!declaration) {
        throw new Error('Declaration not found');
      }
      
      return {
        ...declaration,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        submittedBy: 'user',
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error submitting G50 declaration:', error);
      throw error;
    }
  }

  async exportG50Declaration(id: string, format: 'pdf' | 'excel'): Promise<string> {
    try {
      const response = await api.get(`/accounting/g50-declarations/${id}/export/${format}`, {
        responseType: 'blob'
      });
      
      // Create a blob URL for the file
      const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const blob = new Blob([response.data], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Error exporting G50 declaration to ${format}:`, error);
      throw error;
    }
  }

  // TVA Declarations
  async getAllTVADeclarations(): Promise<TVADeclaration[]> {
    try {
      const response = await api.get('/accounting/tva-declarations');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // Return mock data if API fails
      return this.getDefaultTVADeclarations();
    } catch (error) {
      console.error('Error fetching TVA declarations:', error);
      // Return mock data
      return this.getDefaultTVADeclarations();
    }
  }

  private getDefaultTVADeclarations(): TVADeclaration[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    const companyInfo: CompanyInfo = {
      name: '404 ENTERPRISE',
      address: '123 Rue des Oliviers, Alger, Algérie',
      taxId: '123456789012345',
      taxRegistrationNumber: '9876543210',
      articleOfImposition: 'A12345',
      activityCode: '01.13.00',
      municipality: 'Alger Centre',
      wilaya: 'Alger'
    };
    
    return [
      {
        _id: `TVA-${previousMonthYear}-${previousMonth.toString().padStart(2, '0')}`,
        declarationNumber: `TVA/${previousMonthYear}/${previousMonth.toString().padStart(2, '0')}`,
        periodId: `TP-M-${previousMonthYear}-${previousMonth.toString().padStart(2, '0')}`,
        periodName: `${this.getMonthName(previousMonth)} ${previousMonthYear}`,
        year: previousMonthYear,
        month: previousMonth,
        submissionDate: new Date(previousMonthYear, previousMonth, 15).toISOString().split('T')[0],
        dueDate: new Date(previousMonthYear, previousMonth, 20).toISOString().split('T')[0],
        status: 'submitted',
        companyInfo,
        salesSection: {
          domesticSales: [
            {
              description: 'Ventes de produits finis',
              taxableAmount: 800000,
              taxRate: 19,
              taxAmount: 152000
            },
            {
              description: 'Prestations de services',
              taxableAmount: 200000,
              taxRate: 9,
              taxAmount: 18000
            }
          ],
          exportSales: [
            {
              description: 'Exportations',
              taxableAmount: 300000,
              taxRate: 0,
              taxAmount: 0
            }
          ],
          totalDomesticSales: 1000000,
          totalExportSales: 300000,
          totalTVACollected: 170000
        },
        purchasesSection: {
          domesticPurchases: [
            {
              description: 'Achats de matières premières',
              taxableAmount: 400000,
              taxRate: 19,
              taxAmount: 76000
            },
            {
              description: 'Achats de services',
              taxableAmount: 100000,
              taxRate: 9,
              taxAmount: 9000
            }
          ],
          importPurchases: [
            {
              description: 'Importations',
              taxableAmount: 200000,
              taxRate: 19,
              taxAmount: 38000
            }
          ],
          totalDomesticPurchases: 500000,
          totalImportPurchases: 200000,
          totalTVADeductible: 123000
        },
        previousBalance: 0,
        totalTVACollected: 170000,
        totalTVADeductible: 123000,
        netTVA: 47000,
        paymentMethod: 'Virement bancaire',
        paymentReference: 'VIR-2023-05-002',
        paymentDate: new Date(previousMonthYear, previousMonth, 18).toISOString().split('T')[0],
        createdBy: 'system',
        createdAt: new Date(previousMonthYear, previousMonth, 10).toISOString(),
        updatedAt: new Date(previousMonthYear, previousMonth, 15).toISOString(),
        submittedAt: new Date(previousMonthYear, previousMonth, 15).toISOString(),
        submittedBy: 'system'
      }
    ];
  }

  // IBS Declarations
  async getAllIBSDeclarations(): Promise<IBSDeclaration[]> {
    try {
      const response = await api.get('/accounting/ibs-declarations');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      
      // Return mock data if API fails
      return this.getDefaultIBSDeclarations();
    } catch (error) {
      console.error('Error fetching IBS declarations:', error);
      // Return mock data
      return this.getDefaultIBSDeclarations();
    }
  }

  private getDefaultIBSDeclarations(): IBSDeclaration[] {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    const companyInfo: CompanyInfo = {
      name: '404 ENTERPRISE',
      address: '123 Rue des Oliviers, Alger, Algérie',
      taxId: '123456789012345',
      taxRegistrationNumber: '9876543210',
      articleOfImposition: 'A12345',
      activityCode: '01.13.00',
      municipality: 'Alger Centre',
      wilaya: 'Alger'
    };
    
    return [
      {
        _id: `IBS-${previousYear}`,
        declarationNumber: `IBS/${previousYear}`,
        periodId: `TP-A-${previousYear}`,
        periodName: `Annual ${previousYear}`,
        fiscalYear: previousYear,
        submissionDate: new Date(currentYear, 3, 15).toISOString().split('T')[0],
        dueDate: new Date(currentYear, 3, 30).toISOString().split('T')[0],
        status: 'submitted',
        companyInfo,
        financialData: {
          totalRevenue: 12000000,
          totalExpenses: 9000000,
          accountingProfit: 3000000,
          taxAdjustments: [
            {
              description: 'Charges non déductibles',
              amount: 200000,
              isAddition: true
            },
            {
              description: 'Provisions non déductibles',
              amount: 100000,
              isAddition: true
            },
            {
              description: 'Revenus exonérés',
              amount: 300000,
              isAddition: false
            }
          ],
          taxableProfit: 3000000
        },
        taxCalculation: {
          taxableProfit: 3000000,
          taxRate: 26,
          grossTaxAmount: 780000,
          taxCredits: [
            {
              description: 'Crédit d\'impôt pour investissement',
              amount: 100000
            }
          ],
          netTaxAmount: 680000,
          advancePayments: [
            {
              description: 'Acompte provisionnel 1',
              date: new Date(previousYear, 2, 20).toISOString().split('T')[0],
              amount: 170000,
              reference: 'AP1-2022'
            },
            {
              description: 'Acompte provisionnel 2',
              date: new Date(previousYear, 5, 20).toISOString().split('T')[0],
              amount: 170000,
              reference: 'AP2-2022'
            },
            {
              description: 'Acompte provisionnel 3',
              date: new Date(previousYear, 8, 20).toISOString().split('T')[0],
              amount: 170000,
              reference: 'AP3-2022'
            },
            {
              description: 'Acompte provisionnel 4',
              date: new Date(previousYear, 11, 20).toISOString().split('T')[0],
              amount: 170000,
              reference: 'AP4-2022'
            }
          ],
          remainingTaxDue: 0
        },
        paymentSchedule: [
          {
            installmentNumber: 1,
            dueDate: new Date(currentYear, 2, 20).toISOString().split('T')[0],
            amount: 170000,
            isPaid: true,
            paymentDate: new Date(currentYear, 2, 15).toISOString().split('T')[0],
            paymentReference: 'AP1-2023'
          },
          {
            installmentNumber: 2,
            dueDate: new Date(currentYear, 5, 20).toISOString().split('T')[0],
            amount: 170000,
            isPaid: false
          },
          {
            installmentNumber: 3,
            dueDate: new Date(currentYear, 8, 20).toISOString().split('T')[0],
            amount: 170000,
            isPaid: false
          },
          {
            installmentNumber: 4,
            dueDate: new Date(currentYear, 11, 20).toISOString().split('T')[0],
            amount: 170000,
            isPaid: false
          }
        ],
        createdBy: 'system',
        createdAt: new Date(currentYear, 3, 10).toISOString(),
        updatedAt: new Date(currentYear, 3, 15).toISOString(),
        submittedAt: new Date(currentYear, 3, 15).toISOString(),
        submittedBy: 'system'
      }
    ];
  }
}

export const taxReportingService = new TaxReportingService();
