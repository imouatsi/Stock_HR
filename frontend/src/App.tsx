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
import { Analytics } from './modules/analytics/pages/Analytics';
import { Settings } from './modules/settings/pages/Settings';
import { NotFound } from './components/NotFound';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
              <Route path="/users/new" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
              <Route path="/users/:id" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
              <Route path="/stock" element={<ProtectedRoute><StockList /></ProtectedRoute>} />
              <Route path="/stock/new" element={<ProtectedRoute><StockForm /></ProtectedRoute>} />
              <Route path="/stock/:id" element={<ProtectedRoute><StockForm /></ProtectedRoute>} />
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
