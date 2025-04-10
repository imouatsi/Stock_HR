import { Document } from 'mongoose';

// Financial Statement Item Interface
export interface IFinancialStatementItem {
  code: string;
  label: string;
  accounts: string[];
  value: number;
  previousValue?: number;
  note?: string;
}

// Financial Statement Section Interface
export interface IFinancialStatementSection {
  code: string;
  label: string;
  items: IFinancialStatementItem[];
  total: number;
  previousTotal?: number;
}

// Balance Sheet Assets Interface
export interface IBalanceSheetAssets {
  nonCurrentAssets: IFinancialStatementSection;
  currentAssets: IFinancialStatementSection;
}

// Balance Sheet Liabilities Interface
export interface IBalanceSheetLiabilities {
  equity: IFinancialStatementSection;
  nonCurrentLiabilities: IFinancialStatementSection;
  currentLiabilities: IFinancialStatementSection;
}

// Balance Sheet Interface
export interface IBalanceSheet {
  date: string;
  periodId: string;
  assets: IBalanceSheetAssets;
  liabilities: IBalanceSheetLiabilities;
  totalAssets: number;
  totalLiabilities: number;
  previousTotalAssets?: number;
  previousTotalLiabilities?: number;
}

// Income Statement Interface
export interface IIncomeStatement {
  startDate: string;
  endDate: string;
  periodId: string;
  operatingRevenue: IFinancialStatementSection;
  operatingExpenses: IFinancialStatementSection;
  financialRevenue: IFinancialStatementSection;
  financialExpenses: IFinancialStatementSection;
  extraordinaryItems: IFinancialStatementSection;
  taxes: IFinancialStatementSection;
  operatingResult: number;
  financialResult: number;
  ordinaryResult: number;
  extraordinaryResult: number;
  netResult: number;
  previousOperatingResult?: number;
  previousFinancialResult?: number;
  previousOrdinaryResult?: number;
  previousExtraordinaryResult?: number;
  previousNetResult?: number;
}

// Cash Flow Statement Interface
export interface ICashFlowStatement {
  startDate: string;
  endDate: string;
  periodId: string;
  operatingActivities: IFinancialStatementSection;
  investingActivities: IFinancialStatementSection;
  financingActivities: IFinancialStatementSection;
  netCashFromOperatingActivities: number;
  netCashFromInvestingActivities: number;
  netCashFromFinancingActivities: number;
  netChangeInCash: number;
  openingCashBalance: number;
  closingCashBalance: number;
  previousNetCashFromOperatingActivities?: number;
  previousNetCashFromInvestingActivities?: number;
  previousNetCashFromFinancingActivities?: number;
  previousNetChangeInCash?: number;
  previousOpeningCashBalance?: number;
  previousClosingCashBalance?: number;
}

// Financial Statement Interface
export interface IFinancialStatement extends Document {
  type: 'balance_sheet' | 'income_statement' | 'cash_flow';
  periodId: string;
  date: string;
  comparisonPeriodId?: string;
  status: 'draft' | 'final';
  data: IBalanceSheet | IIncomeStatement | ICashFlowStatement;
  notes?: Map<string, string>;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}
