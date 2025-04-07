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
import { Invoices } from './modules/accounting/pages/Invoices';
import { ProformaInvoices } from './modules/accounting/pages/ProformaInvoices';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* User Management Routes */}
              <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
              <Route path="/users/new" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
              <Route path="/users/:id" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
              
              {/* Stock Management Routes */}
              <Route path="/stock" element={<ProtectedRoute><StockList /></ProtectedRoute>} />
              <Route path="/stock/new" element={<ProtectedRoute><StockForm /></ProtectedRoute>} />
              <Route path="/stock/:id" element={<ProtectedRoute><StockForm /></ProtectedRoute>} />
              <Route path="/stock/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/stock/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
              <Route path="/stock/movements" element={<ProtectedRoute><Movements /></ProtectedRoute>} />
              <Route path="/stock/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              
              {/* Accounting Routes */}
              <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/proforma-invoices" element={<ProtectedRoute><ProformaInvoices /></ProtectedRoute>} />
              
              {/* Analytics and Settings */}
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
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
