import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../modules/shared/components/ProtectedRoute';
import Layout from '../modules/shared/components/Layout';
import Dashboard from '../modules/dashboard/pages/Dashboard';
import Categories from '../modules/stock/pages/Categories';
import Suppliers from '../modules/stock/pages/Suppliers';
import Movements from '../modules/stock/pages/Movements';
import PurchaseOrders from '../modules/stock/pages/PurchaseOrders';
import Inventory from '../modules/stock/pages/Inventory';
import Login from '../modules/auth/pages/Login';
import NotFound from '../modules/shared/pages/NotFound';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        
        {/* Stock Management Routes */}
        <Route path="stock">
          <Route path="categories" element={<Categories />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="movements" element={<Movements />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 