import mongoose from 'mongoose';
import { IFinancialStatement } from '../interfaces/financial-statement.interface';

// Financial Statement Item Schema
const financialStatementItemSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Item code is required'],
    trim: true
  },
  label: {
    type: String,
    required: [true, 'Item label is required'],
    trim: true
  },
  accounts: {
    type: [String],
    default: []
  },
  value: {
    type: Number,
    required: [true, 'Item value is required']
  },
  previousValue: {
    type: Number
  },
  note: {
    type: String
  }
});

// Financial Statement Section Schema
const financialStatementSectionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Section code is required'],
    trim: true
  },
  label: {
    type: String,
    required: [true, 'Section label is required'],
    trim: true
  },
  items: {
    type: [financialStatementItemSchema],
    default: []
  },
  total: {
    type: Number,
    required: [true, 'Section total is required']
  },
  previousTotal: {
    type: Number
  }
});

// Balance Sheet Assets Schema
const balanceSheetAssetsSchema = new mongoose.Schema({
  nonCurrentAssets: {
    type: financialStatementSectionSchema,
    required: [true, 'Non-current assets section is required']
  },
  currentAssets: {
    type: financialStatementSectionSchema,
    required: [true, 'Current assets section is required']
  }
});

// Balance Sheet Liabilities Schema
const balanceSheetLiabilitiesSchema = new mongoose.Schema({
  equity: {
    type: financialStatementSectionSchema,
    required: [true, 'Equity section is required']
  },
  nonCurrentLiabilities: {
    type: financialStatementSectionSchema,
    required: [true, 'Non-current liabilities section is required']
  },
  currentLiabilities: {
    type: financialStatementSectionSchema,
    required: [true, 'Current liabilities section is required']
  }
});

// Balance Sheet Schema
const balanceSheetSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'Balance sheet date is required']
  },
  periodId: {
    type: String,
    required: [true, 'Period ID is required']
  },
  assets: {
    type: balanceSheetAssetsSchema,
    required: [true, 'Assets are required']
  },
  liabilities: {
    type: balanceSheetLiabilitiesSchema,
    required: [true, 'Liabilities are required']
  },
  totalAssets: {
    type: Number,
    required: [true, 'Total assets value is required']
  },
  totalLiabilities: {
    type: Number,
    required: [true, 'Total liabilities value is required']
  },
  previousTotalAssets: {
    type: Number
  },
  previousTotalLiabilities: {
    type: Number
  }
});

// Income Statement Schema
const incomeStatementSchema = new mongoose.Schema({
  startDate: {
    type: String,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: String,
    required: [true, 'End date is required']
  },
  periodId: {
    type: String,
    required: [true, 'Period ID is required']
  },
  operatingRevenue: {
    type: financialStatementSectionSchema,
    required: [true, 'Operating revenue section is required']
  },
  operatingExpenses: {
    type: financialStatementSectionSchema,
    required: [true, 'Operating expenses section is required']
  },
  financialRevenue: {
    type: financialStatementSectionSchema,
    required: [true, 'Financial revenue section is required']
  },
  financialExpenses: {
    type: financialStatementSectionSchema,
    required: [true, 'Financial expenses section is required']
  },
  extraordinaryItems: {
    type: financialStatementSectionSchema,
    required: [true, 'Extraordinary items section is required']
  },
  taxes: {
    type: financialStatementSectionSchema,
    required: [true, 'Taxes section is required']
  },
  operatingResult: {
    type: Number,
    required: [true, 'Operating result is required']
  },
  financialResult: {
    type: Number,
    required: [true, 'Financial result is required']
  },
  ordinaryResult: {
    type: Number,
    required: [true, 'Ordinary result is required']
  },
  extraordinaryResult: {
    type: Number,
    required: [true, 'Extraordinary result is required']
  },
  netResult: {
    type: Number,
    required: [true, 'Net result is required']
  },
  previousOperatingResult: {
    type: Number
  },
  previousFinancialResult: {
    type: Number
  },
  previousOrdinaryResult: {
    type: Number
  },
  previousExtraordinaryResult: {
    type: Number
  },
  previousNetResult: {
    type: Number
  }
});

// Cash Flow Statement Schema
const cashFlowStatementSchema = new mongoose.Schema({
  startDate: {
    type: String,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: String,
    required: [true, 'End date is required']
  },
  periodId: {
    type: String,
    required: [true, 'Period ID is required']
  },
  operatingActivities: {
    type: financialStatementSectionSchema,
    required: [true, 'Operating activities section is required']
  },
  investingActivities: {
    type: financialStatementSectionSchema,
    required: [true, 'Investing activities section is required']
  },
  financingActivities: {
    type: financialStatementSectionSchema,
    required: [true, 'Financing activities section is required']
  },
  netCashFromOperatingActivities: {
    type: Number,
    required: [true, 'Net cash from operating activities is required']
  },
  netCashFromInvestingActivities: {
    type: Number,
    required: [true, 'Net cash from investing activities is required']
  },
  netCashFromFinancingActivities: {
    type: Number,
    required: [true, 'Net cash from financing activities is required']
  },
  netChangeInCash: {
    type: Number,
    required: [true, 'Net change in cash is required']
  },
  openingCashBalance: {
    type: Number,
    required: [true, 'Opening cash balance is required']
  },
  closingCashBalance: {
    type: Number,
    required: [true, 'Closing cash balance is required']
  },
  previousNetCashFromOperatingActivities: {
    type: Number
  },
  previousNetCashFromInvestingActivities: {
    type: Number
  },
  previousNetCashFromFinancingActivities: {
    type: Number
  },
  previousNetChangeInCash: {
    type: Number
  },
  previousOpeningCashBalance: {
    type: Number
  },
  previousClosingCashBalance: {
    type: Number
  }
});

// Financial Statement Schema
const financialStatementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['balance_sheet', 'income_statement', 'cash_flow'],
    required: [true, 'Statement type is required']
  },
  periodId: {
    type: String,
    required: [true, 'Period ID is required']
  },
  date: {
    type: String,
    required: [true, 'Statement date is required']
  },
  comparisonPeriodId: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'final'],
    default: 'draft'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Statement data is required'],
    validate: {
      validator: function(this: any, value: any) {
        if (!this || typeof this.get !== 'function') {
          return true; // Skip validation if context is not available
        }

        const type = this.get('type');
        if (type === 'balance_sheet') {
          return value.assets && value.liabilities && value.totalAssets && value.totalLiabilities;
        } else if (type === 'income_statement') {
          return value.operatingRevenue && value.operatingExpenses && value.netResult !== undefined;
        } else if (type === 'cash_flow') {
          return value.operatingActivities && value.investingActivities && value.financingActivities && value.netChangeInCash !== undefined;
        }
        return false;
      },
      message: 'Invalid statement data for the specified type'
    }
  },
  notes: {
    type: Map,
    of: String,
    default: new Map()
  },
  createdBy: {
    type: String,
    required: [true, 'Creator information is required']
  }
}, {
  timestamps: true
});

export const FinancialStatement = mongoose.model<IFinancialStatement>('FinancialStatement', financialStatementSchema);
