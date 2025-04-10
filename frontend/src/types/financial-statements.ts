// Financial Statement Types for Algerian SCF (Système Comptable Financier)

// Common interfaces
export interface FinancialStatementSection {
  code: string;
  label: string;
  items: FinancialStatementItem[];
  total: number;
  previousTotal?: number;
}

export interface FinancialStatementItem {
  code: string;
  label: string;
  accounts: string[]; // Account codes
  value: number;
  previousValue?: number;
  note?: string;
}

// Balance Sheet (Bilan) interfaces
export interface BalanceSheet {
  date: string;
  periodId: string;
  assets: BalanceSheetAssets;
  liabilities: BalanceSheetLiabilities;
  totalAssets: number;
  totalLiabilities: number;
  previousTotalAssets?: number;
  previousTotalLiabilities?: number;
}

export interface BalanceSheetAssets {
  nonCurrentAssets: FinancialStatementSection;
  currentAssets: FinancialStatementSection;
}

export interface BalanceSheetLiabilities {
  equity: FinancialStatementSection;
  nonCurrentLiabilities: FinancialStatementSection;
  currentLiabilities: FinancialStatementSection;
}

// Income Statement (Compte de Résultat) interfaces
export interface IncomeStatement {
  startDate: string;
  endDate: string;
  periodId: string;
  operatingRevenue: FinancialStatementSection;
  operatingExpenses: FinancialStatementSection;
  financialRevenue: FinancialStatementSection;
  financialExpenses: FinancialStatementSection;
  extraordinaryItems: FinancialStatementSection;
  taxes: FinancialStatementSection;
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

// Cash Flow Statement (Tableau des Flux de Trésorerie) interfaces
export interface CashFlowStatement {
  startDate: string;
  endDate: string;
  periodId: string;
  operatingActivities: FinancialStatementSection;
  investingActivities: FinancialStatementSection;
  financingActivities: FinancialStatementSection;
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

// Financial Statement Report interface
export interface FinancialStatementReport {
  _id?: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow';
  periodId: string;
  date: string;
  comparisonPeriodId?: string;
  status: 'draft' | 'final';
  data: BalanceSheet | IncomeStatement | CashFlowStatement;
  notes?: Record<string, string>;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}
