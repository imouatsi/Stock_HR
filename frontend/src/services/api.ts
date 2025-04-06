import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

// Environment-based configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || '/api',
    timeout: 10000,
  },
  test: {
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
  },
};

const environment = process.env.NODE_ENV || 'development';
const config = API_CONFIG[environment as keyof typeof API_CONFIG];

// Setup cache adapter
const cache = setupCache({
  maxAge: 15 * 60 * 1000, // Cache for 15 minutes
  exclude: {
    // Don't cache auth-related requests
    paths: [/\/auth\//],
    // Don't cache mutations
    methods: ['post', 'put', 'patch', 'delete'],
  },
});

// Create axios instance with cache adapter
export const api = axios.create({
  ...config,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  adapter: cache.adapter,
});

// Secure logging function that removes sensitive data
const logAuthEvent = (event: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const sanitizedDetails = details ? JSON.parse(JSON.stringify(details)) : {};
  
  // Remove sensitive information
  if (sanitizedDetails.headers?.Authorization) {
    sanitizedDetails.headers.Authorization = '[REDACTED]';
  }
  if (sanitizedDetails.token) {
    sanitizedDetails.token = '[REDACTED]';
  }
  if (sanitizedDetails.user) {
    sanitizedDetails.user = {
      ...sanitizedDetails.user,
      email: '[REDACTED]',
      firstName: '[REDACTED]',
      lastName: '[REDACTED]',
    };
  }

  const logEntry = {
    timestamp,
    event,
    details: sanitizedDetails,
    path: window.location.pathname,
  };
  
  // Log to console in development only
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth Event:', logEntry);
  }
  
  try {
    // Store in localStorage with a max size limit
    const MAX_LOGS = 50;
    const logs = JSON.parse(localStorage.getItem('auth_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('auth_logs', JSON.stringify(logs.slice(-MAX_LOGS)));
  } catch (error) {
    console.error('Failed to store auth log:', error);
  }
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logAuthEvent('API Request', {
      url: config.url,
      method: config.method,
      hasToken: !!config.headers.Authorization
    });
    return config;
  },
  (error) => {
    logAuthEvent('API Request Error', { 
      error: error.message,
      url: error.config?.url,
      method: error.config?.method
    });
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    logAuthEvent('API Response Success', {
      url: response.config.url,
      status: response.status,
      method: response.config.method
    });
    return response;
  },
  async (error) => {
    logAuthEvent('API Response Error', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      method: error.config?.method
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect to login if we're not already on the login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        logAuthEvent('Unauthorized Access - Redirecting to Login', {
          currentPath,
          hasToken: !!error.config?.headers?.Authorization
        });
        
        // Let authService handle the cleanup
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);