import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetInactivityTimer: () => void;
  setInactivityTimeout: (seconds: number) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [inactivityTimeout, setInactivityTimeout] = useState<number>(600); // Default 10 minutes (600 seconds)
  const navigate = useNavigate();

  // Reference to the inactivity timer
  const inactivityTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Setup inactivity timer
  const setupInactivityTimer = () => {
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set new timer
    inactivityTimerRef.current = setTimeout(() => {
      // Log out the user when timer expires
      if (user) {
        console.log(`Logging out due to inactivity (${inactivityTimeout} seconds)`);
        logout();
      }
    }, inactivityTimeout * 1000);
  };

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    if (user) {
      setupInactivityTimer();
    }
  };

  // Set inactivity timeout
  const setInactivityTimeoutValue = (seconds: number) => {
    // Ensure the timeout is between 10 seconds and 10 minutes
    const validatedTimeout = Math.max(10, Math.min(600, seconds));
    setInactivityTimeout(validatedTimeout);

    // Reset the timer with the new timeout
    resetInactivityTimer();

    // Save the setting to localStorage
    localStorage.setItem('inactivityTimeout', validatedTimeout.toString());
  };

  // Initialize from localStorage and setup event listeners
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const savedTimeout = localStorage.getItem('inactivityTimeout');

    // Restore saved timeout if available
    if (savedTimeout) {
      setInactivityTimeout(parseInt(savedTimeout, 10));
    }

    if (token && userJson) {
      try {
        const userData = JSON.parse(userJson);

        // Validate that the user data has the required fields
        if (!userData.role) {
          // Set a default role if missing
          userData.role = 'superadmin';
        }

        // Ensure username is present
        if (!userData.username) {
          userData.username = 'User';
        }

        // Update localStorage with the validated user data
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);

        // Setup inactivity timer when user is loaded
        setupInactivityTimer();

        // Setup event listeners for user activity
        const resetTimer = () => resetInactivityTimer();
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('mousedown', resetTimer);
        window.addEventListener('keypress', resetTimer);
        window.addEventListener('touchmove', resetTimer);
        window.addEventListener('scroll', resetTimer);

        return () => {
          // Clean up event listeners
          window.removeEventListener('mousemove', resetTimer);
          window.removeEventListener('mousedown', resetTimer);
          window.removeEventListener('keypress', resetTimer);
          window.removeEventListener('touchmove', resetTimer);
          window.removeEventListener('scroll', resetTimer);

          // Clear the timer
          if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
          }
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      try {
        // Try to connect to the backend API
        const response = await apiService.post('/auth/login', { username, password });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        navigate('/dashboard');
      } catch (apiError) {
        console.error('API connection failed, using mock data:', apiError);

        // Fallback to mock login for development if API is not available
        if (username === 'superadmin' && password === 'Admin@123') {
          const mockUser = {
            id: '1',
            username: 'superadmin',
            firstName: 'Super',
            lastName: 'Admin',
            role: 'superadmin', // This should match one of the avatar image names
            isActive: true,
            permissions: ['all'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmQ3YzRkMzRkMzRkMzRkMzRkMzRkMyIsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNjE1MjM5MDIyLCJleHAiOjE2MTUzMjU0MjJ9.7dKxerLxEYh_zH8uQmKjZOlXxjRBPR50TRfZp9TTOlQ';

          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          navigate('/dashboard');
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    // Clear the inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    navigate('/login');
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // In a real app, you would call the API to change the password
      // const response = await apiService.post('/auth/change-password', { currentPassword, newPassword });

      // For development purposes, let's simulate a password change
      if (currentPassword === 'Admin@123') {
        // Password change successful
        // In a real app, you might get a new token here
        return Promise.resolve();
      } else {
        // Current password is incorrect
        return Promise.reject(new Error('Current password is incorrect'));
      }
    } catch (error) {
      console.error('Password change failed:', error);
      return Promise.reject(error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    changePassword,
    resetInactivityTimer,
    setInactivityTimeout: setInactivityTimeoutValue,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
