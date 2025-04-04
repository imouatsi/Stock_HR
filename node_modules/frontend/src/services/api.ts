import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache = setupCache({
  maxAge: 15 * 60 * 1000 // Cache for 15 minutes
});

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: cache.adapter
});

// Logging function
const logAuthEvent = (event: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    details,
    path: window.location.pathname,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  };
  
  // Log to console
  console.log('Auth Event:', logEntry);
  
  // Store in localStorage
  const logs = JSON.parse(localStorage.getItem('auth_logs') || '[]');
  logs.push(logEntry);
  localStorage.setItem('auth_logs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      logAuthEvent('API Request', {
        url: config.url,
        method: config.method,
        hasToken: true
      });
    } else {
      logAuthEvent('API Request - No Token', {
        url: config.url,
        method: config.method
      });
    }
    return config;
  },
  (error) => {
    logAuthEvent('API Request Error', { error: error.message });
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    logAuthEvent('API Response Success', {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error) => {
    logAuthEvent('API Response Error', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        logAuthEvent('Unauthorized Access - Redirecting to Login', {
          currentPath,
          token: !!localStorage.getItem('token'),
          user: localStorage.getItem('user')
        });
        
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;