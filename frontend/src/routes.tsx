import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './features/store';
import { UserRole } from './types';

// Layout
import Layout from './components/Layout';

// Auth Pages
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import ForgotPassword from './modules/auth/pages/ForgotPassword';
import ResetPassword from './modules/auth/pages/ResetPassword';

// Dashboard
import Dashboard from './pages/Dashboard';

// Stock Module
import StockDashboard from './modules/stock/pages/Dashboard';
import StockList from './modules/stock/pages/StockList';
import StockCategories from './modules/stock/pages/Categories';
import Suppliers from './modules/stock/pages/Suppliers';
import PurchaseOrders from './modules/stock/pages/PurchaseOrders';

// HR Module
import HRDashboard from './modules/hr/pages/Dashboard';
import Employees from './modules/hr/pages/Employees';
import Departments from './modules/hr/pages/Departments';
import Positions from './modules/hr/pages/Positions';
import LeaveRequests from './modules/hr/pages/LeaveRequests';
import PerformanceReviews from './modules/hr/pages/PerformanceReviews';

// Accounting Module
import AccountingDashboard from './modules/accounting/pages/Dashboard';
import Invoices from './modules/accounting/pages/Invoices';
import Proforma from './modules/accounting/pages/Proforma';
import Contracts from './modules/accounting/pages/Contracts';
import JournalEntries from './modules/accounting/pages/JournalEntries';
import ChartOfAccounts from './modules/accounting/pages/ChartOfAccounts';
import FinancialStatements from './modules/accounting/pages/FinancialStatements';

// Settings
import Settings from './pages/Settings';

// Role-based route wrapper
const RoleBasedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.includes(user.role as UserRole);
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Module-based route wrapper
const ModuleRoute: React.FC<{
  children: React.ReactNode;
  module: string;
}> = ({ children, module }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasModuleAccess = (role: UserRole, module: string): boolean => {
    switch (role) {
      case 'superadmin':
      case 'admin':
        return true;
      case 'hr_manager':
        return module === 'hr';
      case 'accountant':
        return module === 'accounting';
      case 'stock_manager':
        return module === 'stock';
      case 'finance_manager':
        return module === 'finance';
      default:
        return false;
    }
  };

  const hasAccess = hasModuleAccess(user.role as UserRole, module);
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route path="/" element={
        <RoleBasedRoute allowedRoles={['superadmin', 'admin', 'manager', 'seller', 'stock_clerk', 'hr_manager', 'accountant', 'stock_manager', 'employee', 'finance_manager']}>
          <Layout />
        </RoleBasedRoute>
      }>
        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Stock Module */}
        <Route path="stock">
          <Route index element={
            <ModuleRoute module="stock">
              <StockDashboard />
            </ModuleRoute>
          } />
          <Route path="list" element={
            <ModuleRoute module="stock">
              <StockList />
            </ModuleRoute>
          } />
          <Route path="categories" element={
            <ModuleRoute module="stock">
              <StockCategories />
            </ModuleRoute>
          } />
          <Route path="suppliers" element={
            <ModuleRoute module="stock">
              <Suppliers />
            </ModuleRoute>
          } />
          <Route path="purchase-orders" element={
            <ModuleRoute module="stock">
              <PurchaseOrders />
            </ModuleRoute>
          } />
        </Route>

        {/* HR Module */}
        <Route path="hr">
          <Route index element={
            <ModuleRoute module="hr">
              <HRDashboard />
            </ModuleRoute>
          } />
          <Route path="employees" element={
            <ModuleRoute module="hr">
              <Employees />
            </ModuleRoute>
          } />
          <Route path="departments" element={
            <ModuleRoute module="hr">
              <Departments />
            </ModuleRoute>
          } />
          <Route path="positions" element={
            <ModuleRoute module="hr">
              <Positions />
            </ModuleRoute>
          } />
          <Route path="leave-requests" element={
            <ModuleRoute module="hr">
              <LeaveRequests />
            </ModuleRoute>
          } />
          <Route path="performance-reviews" element={
            <ModuleRoute module="hr">
              <PerformanceReviews />
            </ModuleRoute>
          } />
        </Route>

        {/* Accounting Module */}
        <Route path="accounting">
          <Route index element={
            <ModuleRoute module="accounting">
              <AccountingDashboard />
            </ModuleRoute>
          } />
          <Route path="invoices" element={
            <ModuleRoute module="accounting">
              <Invoices />
            </ModuleRoute>
          } />
          <Route path="proforma" element={
            <ModuleRoute module="accounting">
              <Proforma />
            </ModuleRoute>
          } />
          <Route path="contracts" element={
            <ModuleRoute module="accounting">
              <Contracts />
            </ModuleRoute>
          } />
          <Route path="journal-entries" element={
            <ModuleRoute module="accounting">
              <JournalEntries />
            </ModuleRoute>
          } />
          <Route path="chart-of-accounts" element={
            <ModuleRoute module="accounting">
              <ChartOfAccounts />
            </ModuleRoute>
          } />
          <Route path="financial-statements" element={
            <ModuleRoute module="accounting">
              <FinancialStatements />
            </ModuleRoute>
          } />
        </Route>

        {/* Settings */}
        <Route path="settings" element={
          <RoleBasedRoute allowedRoles={['superadmin', 'admin']}>
            <Settings />
          </RoleBasedRoute>
        } />
      </Route>

      {/* Catch all unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes; 