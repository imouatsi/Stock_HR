import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../models/user.model';
import { typedLogger } from '../../../utils/logger';

// Define role hierarchies
const roleHierarchy: Record<UserRole, UserRole[]> = {
  superadmin: ['admin', 'manager', 'seller', 'stock_clerk', 'hr_manager', 'accountant', 'stock_manager', 'employee', 'finance_manager'],
  admin: ['manager', 'seller', 'stock_clerk', 'hr_manager', 'accountant', 'stock_manager', 'employee', 'finance_manager'],
  manager: ['seller', 'stock_clerk', 'employee'],
  hr_manager: ['employee'],
  accountant: [],
  stock_manager: ['stock_clerk'],
  finance_manager: ['accountant'],
  seller: [],
  stock_clerk: [],
  employee: [],
};

// Define module-specific permissions
const modulePermissions: Record<string, string[]> = {
  hr: ['hr:create', 'hr:read', 'hr:update', 'hr:delete'],
  stock: ['stock:create', 'stock:read', 'stock:update', 'stock:delete'],
  accounting: ['accounting:create', 'accounting:read', 'accounting:update', 'accounting:delete'],
  finance: ['finance:create', 'finance:read', 'finance:update', 'finance:delete'],
};

// Helper function to check if a role has access to another role
const hasRoleAccess = (userRole: UserRole, targetRole: UserRole): boolean => {
  if (userRole === targetRole) return true;
  return roleHierarchy[userRole]?.includes(targetRole) || false;
};

// Helper function to check if a role has access to a module
const hasModuleAccess = (userRole: UserRole, module: string): boolean => {
  const modulePerms = modulePermissions[module];
  if (!modulePerms) return false;

  switch (userRole) {
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

// Middleware to check role access
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role as UserRole;
      
      if (!userRole) {
        typedLogger.warn('No user role found in request');
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const hasAccess = allowedRoles.some(role => hasRoleAccess(userRole, role));
      
      if (!hasAccess) {
        typedLogger.warn('User does not have required role access', {
          userRole,
          requiredRoles: allowedRoles,
        });
        return res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
      }

      next();
    } catch (error) {
      typedLogger.error('Error in role check middleware:', { error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check module access
export const checkModuleAccess = (module: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role as UserRole;
      
      if (!userRole) {
        typedLogger.warn('No user role found in request');
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const hasAccess = hasModuleAccess(userRole, module);
      
      if (!hasAccess) {
        typedLogger.warn('User does not have access to module', {
          userRole,
          module,
        });
        return res.status(403).json({ message: 'Forbidden: Insufficient module access' });
      }

      next();
    } catch (error) {
      typedLogger.error('Error in module access check middleware:', { error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check specific permission
export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPermissions = req.user?.permissions as string[];
      
      if (!userPermissions) {
        typedLogger.warn('No user permissions found in request');
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const hasAccess = userPermissions.includes(permission);
      
      if (!hasAccess) {
        typedLogger.warn('User does not have required permission', {
          userPermissions,
          requiredPermission: permission,
        });
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      typedLogger.error('Error in permission check middleware:', { error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}; 