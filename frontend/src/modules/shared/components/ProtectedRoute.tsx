import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  route?: {
    roles?: string[];
    permissions?: string[];
  };
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, route }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(false);

  console.log('ProtectedRoute - Auth state:', { isAuthenticated, isLoading, user });

  // Force check localStorage directly as a backup
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const isTokenPresent = !!token;
  const localUser = userJson ? JSON.parse(userJson) : null;

  console.log('ProtectedRoute - Token in localStorage:', { isTokenPresent });
  console.log('ProtectedRoute - User in localStorage:', localUser);

  // Consider authenticated if either context says so OR we have a token and user in localStorage
  const effectivelyAuthenticated = isAuthenticated || (isTokenPresent && !!localUser);

  if (isLoading || localLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated and no token, redirect to login
  if (!effectivelyAuthenticated) {
    console.log('ProtectedRoute - Redirecting to login');
    // Clear any stale data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions using either context user or localStorage user
  const effectiveUser = user || localUser;
  if (route?.roles && effectiveUser) {
    const hasRequiredRole = route.roles.includes(effectiveUser.role);
    if (!hasRequiredRole) {
      console.log('ProtectedRoute - User does not have required role:', {
        requiredRoles: route.roles,
        userRole: effectiveUser.role
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;