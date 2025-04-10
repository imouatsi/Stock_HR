import React, { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/NewLayout';
import MuiThemeProvider from './components/mui-theme-provider';

// Core pages
import { Dashboard } from './modules/dashboard/pages/Dashboard';
import { Login } from './modules/auth/pages/Login';
import { NotFound } from './components/NotFound';

// User Module
import Profile from './modules/user/pages/Profile';
import Settings from './modules/user/pages/Settings';

// HR Module
import HRDashboard from './modules/hr/pages/Dashboard';
import Employees from './modules/hr/pages/Employees';
import Departments from './modules/hr/pages/Departments';
import Positions from './modules/hr/pages/Positions';
import LeaveRequests from './modules/hr/pages/LeaveRequests';
import PerformanceReviews from './modules/hr/pages/PerformanceReviews';

// Accounting Module
import { AccountingDashboard } from './modules/accounting/pages/Dashboard';
import Invoices from './modules/accounting/pages/Invoices';
import { ProformaInvoices } from './modules/accounting/pages/ProformaInvoices';
import { Contracts } from './modules/accounting/pages/Contracts';
import JournalEntries from './modules/accounting/pages/JournalEntries';
import { ChartOfAccounts } from './modules/accounting/pages/ChartOfAccounts';
import FinancialStatements from './modules/accounting/pages/FinancialStatements';

// Lazy loaded accounting pages
const TaxReporting = lazy(() => import('./modules/accounting/pages/TaxReporting'));
const G50Declaration = lazy(() => import('./modules/accounting/pages/G50Declaration'));

// Stock Module
import { Categories } from './modules/stock/pages/Categories';
import { Suppliers } from './modules/stock/pages/Suppliers';
import { Movements } from './modules/stock/pages/Movements';
import { Inventory } from './modules/stock/pages/Inventory';
import PurchaseOrders from './modules/stock/pages/PurchaseOrders';
import StockDashboard from './modules/stock/pages/Dashboard';

// Roles are now handled in the AuthContext

const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set the dir attribute on the html element based on the language
    document.documentElement.dir = i18n.dir();
  }, [i18n]);

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <MuiThemeProvider>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* HR Routes */}
          <Route path="hr">
            <Route index element={<HRDashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="departments" element={<Departments />} />
            <Route path="positions" element={<Positions />} />
            <Route path="leave-requests" element={<LeaveRequests />} />
            <Route path="performance-reviews" element={<PerformanceReviews />} />
            <Route path="performance" element={<PerformanceReviews />} />
          </Route>

          {/* Accounting Routes */}
          <Route path="accounting">
            <Route index element={<AccountingDashboard />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="proforma-invoices" element={<ProformaInvoices />} />
            <Route path="proformas" element={<ProformaInvoices />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="journal-entries" element={<JournalEntries />} />
            <Route path="journal" element={<JournalEntries />} />
            <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
            <Route path="chart" element={<ChartOfAccounts />} />
            <Route path="financial-statements" element={<FinancialStatements />} />
            <Route path="statements" element={<FinancialStatements />} />
            <Route path="tax-reporting" element={
              <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                <TaxReporting />
              </Suspense>
            } />
            <Route path="tax-reporting/g50" element={
              <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                <G50Declaration />
              </Suspense>
            } />
          </Route>

          {/* Stock Routes */}
          <Route path="stock">
            <Route index element={<StockDashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="movements" element={<Movements />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
          </Route>

          {/* User Routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
          <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </MuiThemeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;



