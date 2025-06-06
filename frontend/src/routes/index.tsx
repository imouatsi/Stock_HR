import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../modules/shared/components/ProtectedRoute';
import NewLayout from '../components/NewLayout';
import Dashboard from '../modules/dashboard/pages/Dashboard';
import Categories from '../modules/stock/pages/Categories';
import Suppliers from '../modules/stock/pages/Suppliers';
import Movements from '../modules/stock/pages/Movements';
import PurchaseOrders from '../modules/stock/pages/PurchaseOrders';
import Inventory from '../modules/stock/pages/Inventory';

// New Stock Module
import Products from '../modules/stock/pages/Products';
import ProductForm from '../modules/stock/pages/ProductForm';
import ProductDetail from '../modules/stock/pages/ProductDetail';
import Warehouses from '../modules/stock/pages/Warehouses';
import WarehouseForm from '../modules/stock/pages/WarehouseForm';
import WarehouseDetail from '../modules/stock/pages/WarehouseDetail';
import Login from '../modules/auth/pages/Login';
import NotFound from '../modules/shared/pages/NotFound';
import Profile from '../modules/profile/pages/Profile';
import Settings from '../components/Settings';

// HR Module
import HRDashboard from '../modules/hr/pages/Dashboard';
import Employees from '../modules/hr/pages/Employees';
import Departments from '../modules/hr/pages/Departments';
import Positions from '../modules/hr/pages/Positions';
import LeaveRequests from '../modules/hr/pages/LeaveRequests';
import PerformanceReviews from '../modules/hr/pages/PerformanceReviews';

// Accounting Module
import AccountingDashboard from '../modules/accounting/pages/Dashboard';
import Invoices from '../modules/accounting/pages/Invoices';
import Proforma from '../modules/accounting/pages/Proforma';
import Contracts from '../modules/accounting/pages/Contracts';
import JournalEntries from '../modules/accounting/pages/JournalEntries';
import ChartOfAccounts from '../modules/accounting/pages/ChartOfAccounts';
import FinancialStatements from '../modules/accounting/pages/FinancialStatements';
import AccountingPeriods from '../modules/accounting/pages/AccountingPeriods';
import GeneralLedger from '../modules/accounting/pages/GeneralLedger';
const TaxReporting = React.lazy(() => import('../modules/accounting/pages/TaxReporting'));

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

      <Route path="/" element={<ProtectedRoute><NewLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Profile Route */}
        <Route path="profile" element={<Profile />} />

        {/* Stock Management Routes */}
        <Route path="stock">
          <Route path="categories" element={<Categories />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="movements" element={<Movements />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="inventory" element={<Inventory />} />

          {/* New Stock Module Routes */}
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/:id/edit" element={<ProductForm />} />

          {/* Warehouse Routes */}
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="warehouses/new" element={<WarehouseForm />} />
          <Route path="warehouses/:id" element={<WarehouseDetail />} />
          <Route path="warehouses/:id/edit" element={<WarehouseForm />} />
        </Route>

        {/* HR Module Routes */}
        <Route path="hr">
          <Route index element={<HRDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="departments" element={<Departments />} />
          <Route path="positions" element={<Positions />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="performance-reviews" element={<PerformanceReviews />} />
          <Route path="payroll" element={<Suspense fallback={<div>Loading...</div>}>{React.createElement(React.lazy(() => import('../modules/hr/pages/Payroll')))}</Suspense>} />
        </Route>

        {/* Accounting Module Routes */}
        <Route path="accounting">
          <Route index element={<AccountingDashboard />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="proformas" element={<Proforma />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="journal-entries" element={<JournalEntries />} />
          <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
          <Route path="accounting-periods" element={<AccountingPeriods />} />
          <Route path="general-ledger" element={<GeneralLedger />} />
          <Route path="financial-statements" element={<FinancialStatements />} />
          <Route path="tax-reporting" element={<Suspense fallback={<div>Loading...</div>}><TaxReporting /></Suspense>} />
        </Route>

        {/* Settings Route */}
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;