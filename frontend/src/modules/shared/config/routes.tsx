import React from 'react';
import { RouteObject } from 'react-router-dom';
import { UserRole } from '../types/user';

// Stock Module
import StockList from '../../stock/pages/StockList';
import Categories from '../../stock/pages/Categories';
import Suppliers from '../../stock/pages/Suppliers';
import Movements from '../../stock/pages/Movements';

// HR Module
import { EmployeeService } from '../../hr/EmployeeService';
import { DepartmentService } from '../../hr/DepartmentService';
import { PositionService } from '../../hr/PositionService';
import { EmployeeDetails } from '../../hr/EmployeeDetails';

// Accounting Module
import Dashboard from '../../accounting/pages/Dashboard';
import Invoices from '../../accounting/pages/Invoices';
import Contracts from '../../accounting/pages/Contracts';
import Proformas from '../../accounting/pages/Proformas';

// Settings
import Settings from '../../settings/pages/Settings';

export interface RouteConfig extends RouteObject {
  roles?: UserRole[];
  permissions?: string[];
  children?: RouteConfig[];
  element: React.ReactNode;
}

// Public routes that don't require authentication
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      {React.createElement(React.lazy(() => import('../../auth/pages/Login')))}
    </React.Suspense>,
  },
  {
    path: '/register',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      {React.createElement(React.lazy(() => import('../../auth/pages/Register')))}
    </React.Suspense>,
  },
  {
    path: '/forgot-password',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      {React.createElement(React.lazy(() => import('../../auth/pages/ForgotPassword')))}
    </React.Suspense>,
  },
  {
    path: '/reset-password',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      {React.createElement(React.lazy(() => import('../../auth/pages/ResetPassword')))}
    </React.Suspense>,
  },
];

// Protected routes that require authentication and specific roles/permissions
export const protectedRoutes: RouteConfig[] = [
  // Dashboard
  {
    path: '/dashboard',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      {React.createElement(React.lazy(() => import('../../dashboard/pages/Dashboard')))}
    </React.Suspense>,
    roles: ['superadmin', 'admin', 'manager', 'hr_manager', 'accountant', 'stock_manager', 'finance_manager'],
  },

  // Stock Module
  {
    path: '/stock',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      {React.createElement(React.lazy(() => import('../../stock/pages/StockList')))}
    </React.Suspense>,
    roles: ['superadmin', 'admin', 'manager', 'stock_manager', 'stock_clerk'],
    permissions: ['stock:read'],
    children: [
      {
        path: 'categories',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          {React.createElement(React.lazy(() => import('../../stock/pages/Categories')))}
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'stock_manager'],
        permissions: ['stock:read'],
      },
      {
        path: 'suppliers',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          {React.createElement(React.lazy(() => import('../../stock/pages/Suppliers')))}
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'stock_manager'],
        permissions: ['stock:read'],
      },
      {
        path: 'movements',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          {React.createElement(React.lazy(() => import('../../stock/pages/Movements')))}
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'stock_manager', 'stock_clerk'],
        permissions: ['stock:read'],
      },
    ],
  },

  // HR Module
  {
    path: '/hr',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      <EmployeeService />
    </React.Suspense>,
    roles: ['superadmin', 'admin', 'hr_manager'],
    permissions: ['hr:read'],
    children: [
      {
        path: 'employees',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          <EmployeeService />
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'hr_manager'],
        permissions: ['hr:read'],
      },
      {
        path: 'employees/:id',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          <EmployeeDetails />
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'hr_manager'],
        permissions: ['hr:read'],
      },
      {
        path: 'departments',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          <DepartmentService />
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'hr_manager'],
        permissions: ['hr:read'],
      },
      {
        path: 'positions',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          <PositionService />
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'hr_manager'],
        permissions: ['hr:read'],
      },
      {
        path: 'payroll',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          {React.createElement(React.lazy(() => import('../../hr/pages/Payroll')))}
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'hr_manager', 'accountant'],
        permissions: ['hr:read', 'accounting:read'],
      },
    ],
  },

  // Accounting Module
  {
    path: '/accounting',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      {React.createElement(React.lazy(() => import('../../accounting/pages/Dashboard')))}
    </React.Suspense>,
    roles: ['superadmin', 'admin', 'accountant', 'finance_manager'],
    permissions: ['accounting:read'],
    children: [
      {
        path: 'invoices',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          {React.createElement(React.lazy(() => import('../../accounting/pages/Invoices')))}
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'accountant', 'finance_manager'],
        permissions: ['accounting:read'],
      },
      {
        path: 'contracts',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          {React.createElement(React.lazy(() => import('../../accounting/pages/Contracts')))}
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'accountant', 'finance_manager'],
        permissions: ['accounting:read'],
      },
      {
        path: 'proformas',
        element: <React.Suspense fallback={<div>Loading...</div>}>
          {React.createElement(React.lazy(() => import('../../accounting/pages/Proformas')))}
        </React.Suspense>,
        roles: ['superadmin', 'admin', 'accountant', 'finance_manager'],
        permissions: ['accounting:read'],
      },
    ],
  },

  // Settings
  {
    path: '/settings',
    element: <React.Suspense fallback={<div>Loading...</div>}>
      {React.createElement(React.lazy(() => import('../../settings/pages/Settings')))}
    </React.Suspense>,
    roles: ['superadmin', 'admin'],
  },
];