// Application configuration

// API configuration
export const API_BASE_URL = 'http://localhost:5000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// Localization
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'];

// UI Configuration
export const DEFAULT_THEME = 'light';
export const DEFAULT_ITEMS_PER_PAGE = 10;
export const PAGINATION_OPTIONS = [5, 10, 25, 50, 100];

// Date and Time
export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
export const DEFAULT_TIME_FORMAT = 'HH:mm';

// Feature Flags
export const FEATURES = {
  NOTIFICATIONS: true,
  DARK_MODE: true,
  ANALYTICS: true,
  EXPORT_DATA: true,
  IMPORT_DATA: true,
  MULTI_LANGUAGE: true,
};

// Module Configuration
export const MODULES = {
  STOCK: {
    enabled: true,
    routes: {
      base: '/stock',
      inventory: '/stock/inventory',
      categories: '/stock/categories',
      suppliers: '/stock/suppliers',
      movements: '/stock/movements',
      purchaseOrders: '/stock/purchase-orders',
    },
  },
  HR: {
    enabled: true,
    routes: {
      base: '/hr',
      employees: '/hr/employees',
      departments: '/hr/departments',
      positions: '/hr/positions',
      leaveRequests: '/hr/leave-requests',
      performanceReviews: '/hr/performance-reviews',
    },
  },
  ACCOUNTING: {
    enabled: true,
    routes: {
      base: '/accounting',
      invoices: '/accounting/invoices',
      proformaInvoices: '/accounting/proforma-invoices',
      contracts: '/accounting/contracts',
      journalEntries: '/accounting/journal-entries',
      chartOfAccounts: '/accounting/chart-of-accounts',
      financialStatements: '/accounting/financial-statements',
    },
  },
};
