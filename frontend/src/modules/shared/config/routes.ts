import { UserRole } from '../types';

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<any>;
  roles?: UserRole[];
  permissions?: string[];
  children?: RouteConfig[];
}

// Public routes that don't require authentication
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: React.lazy(() => import('../../auth/pages/Login')),
  },
  {
    path: '/register',
    component: React.lazy(() => import('../../auth/pages/Register')),
  },
  {
    path: '/forgot-password',
    component: React.lazy(() => import('../../auth/pages/ForgotPassword')),
  },
  {
    path: '/reset-password',
    component: React.lazy(() => import('../../auth/pages/ResetPassword')),
  },
];

// Protected routes that require authentication and specific roles/permissions
export const protectedRoutes: RouteConfig[] = [
  // Dashboard
  {
    path: '/dashboard',
    component: React.lazy(() => import('../../dashboard/pages/Dashboard')),
    roles: ['superadmin', 'admin', 'manager', 'hr_manager', 'accountant', 'stock_manager', 'finance_manager'],
  },

  // Stock Module
  {
    path: '/stock',
    component: React.lazy(() => import('../../stock/pages/StockList')),
    roles: ['superadmin', 'admin', 'manager', 'stock_manager', 'stock_clerk'],
    permissions: ['stock:read'],
    children: [
      {
        path: 'categories',
        component: React.lazy(() => import('../../stock/pages/Categories')),
        roles: ['superadmin', 'admin', 'stock_manager'],
        permissions: ['stock:read'],
      },
      {
        path: 'suppliers',
        component: React.lazy(() => import('../../stock/pages/Suppliers')),
        roles: ['superadmin', 'admin', 'stock_manager'],
        permissions: ['stock:read'],
      },
      {
        path: 'movements',
        component: React.lazy(() => import('../../stock/pages/Movements')),
        roles: ['superadmin', 'admin', 'stock_manager', 'stock_clerk'],
        permissions: ['stock:read'],
      },
    ],
  },

  // HR Module
  {
    path: '/hr',
    component: React.lazy(() => import('../../hr/pages/EmployeeList')),
    roles: ['superadmin', 'admin', 'hr_manager'],
    permissions: ['hr:read'],
    children: [
      {
        path: 'departments',
        component: React.lazy(() => import('../../hr/pages/Departments')),
        roles: ['superadmin', 'admin', 'hr_manager'],
        permissions: ['hr:read'],
      },
      {
        path: 'positions',
        component: React.lazy(() => import('../../hr/pages/Positions')),
        roles: ['superadmin', 'admin', 'hr_manager'],
        permissions: ['hr:read'],
      },
      {
        path: 'leave',
        component: React.lazy(() => import('../../hr/pages/LeaveRequests')),
        roles: ['superadmin', 'admin', 'hr_manager', 'employee'],
        permissions: ['hr:read'],
      },
    ],
  },

  // Accounting Module
  {
    path: '/accounting',
    component: React.lazy(() => import('../../accounting/pages/Dashboard')),
    roles: ['superadmin', 'admin', 'accountant', 'finance_manager'],
    permissions: ['accounting:read'],
    children: [
      {
        path: 'invoices',
        component: React.lazy(() => import('../../accounting/pages/Invoices')),
        roles: ['superadmin', 'admin', 'accountant', 'finance_manager'],
        permissions: ['accounting:read'],
      },
      {
        path: 'contracts',
        component: React.lazy(() => import('../../accounting/pages/Contracts')),
        roles: ['superadmin', 'admin', 'accountant', 'finance_manager'],
        permissions: ['accounting:read'],
      },
      {
        path: 'proformas',
        component: React.lazy(() => import('../../accounting/pages/Proformas')),
        roles: ['superadmin', 'admin', 'accountant', 'finance_manager'],
        permissions: ['accounting:read'],
      },
    ],
  },

  // Settings
  {
    path: '/settings',
    component: React.lazy(() => import('../../settings/pages/Settings')),
    roles: ['superadmin', 'admin'],
  },
]; 