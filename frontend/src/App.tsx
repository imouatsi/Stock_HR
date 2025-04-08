import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/NewLayout';
import { Dashboard } from './modules/dashboard/pages/Dashboard';
import { Login } from './modules/auth/pages/Login';
import { UserList } from './modules/user/pages/UserList';
import { UserForm } from './modules/user/pages/UserForm';
import { StockList } from './modules/stock/pages/StockList';
import { StockForm } from './modules/stock/pages/StockForm';
import { Categories } from './modules/stock/pages/Categories';
import { Suppliers } from './modules/stock/pages/Suppliers';
import { Movements } from './modules/stock/pages/Movements';
import { Inventory } from './modules/stock/pages/Inventory';
import { Analytics } from './modules/analytics/pages/Analytics';
import { Settings } from './modules/settings/pages/Settings';
import { NotFound } from './components/NotFound';
import { Contracts } from './modules/accounting/pages/Contracts';
import Invoices from './modules/accounting/pages/Invoices';
import { ProformaInvoices } from './modules/accounting/pages/ProformaInvoices';

// Define role constants
const ROLES = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  HR_MANAGER: 'hr_manager',
  ACCOUNTANT: 'accountant',
  STOCK_MANAGER: 'stock_manager'
} as const;

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              {/* Dashboard - accessible to all authenticated users */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* User Management Routes - Admin & Superadmin only */}
              <Route path="/users" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <UserList />
                </ProtectedRoute>
              } />
              <Route path="/users/new" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <UserForm />
                </ProtectedRoute>
              } />
              <Route path="/users/:id" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <UserForm />
                </ProtectedRoute>
              } />
              
              {/* Stock Management Routes - Stock Manager, Admin & Superadmin */}
              <Route path="/stock" element={
                <ProtectedRoute roles={[ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <StockList />
                </ProtectedRoute>
              } />
              <Route path="/stock/new" element={
                <ProtectedRoute roles={[ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <StockForm />
                </ProtectedRoute>
              } />
              <Route path="/stock/:id" element={
                <ProtectedRoute roles={[ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <StockForm />
                </ProtectedRoute>
              } />
              <Route path="/stock/categories" element={
                <ProtectedRoute roles={[ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/stock/suppliers" element={
                <ProtectedRoute roles={[ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <Suppliers />
                </ProtectedRoute>
              } />
              <Route path="/stock/movements" element={
                <ProtectedRoute roles={[ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <Movements />
                </ProtectedRoute>
              } />
              <Route path="/stock/inventory" element={
                <ProtectedRoute roles={[ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <Inventory />
                </ProtectedRoute>
              } />
              
              {/* Accounting Routes - Accountant, Admin & Superadmin */}
              <Route path="/contracts" element={
                <ProtectedRoute roles={[ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <Contracts />
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute roles={[ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <Invoices />
                </ProtectedRoute>
              } />
              <Route path="/proforma-invoices" element={
                <ProtectedRoute roles={[ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <ProformaInvoices />
                </ProtectedRoute>
              } />
              
              {/* Analytics - Admin & Superadmin only */}
              <Route path="/analytics" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <Analytics />
                </ProtectedRoute>
              } />
              
              {/* Settings - accessible to all authenticated users */}
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
