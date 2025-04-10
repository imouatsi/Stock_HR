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
  // Initialize user state from localStorage if available
  const initialUser = (() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user');
      }
    }
    return null;
  })();

  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(true);
  const [inactivityTimeout, setInactivityTimeout] = useState<number>(
    parseInt(localStorage.getItem('inactivityTimeout') || '600', 10)
  ); // Default 10 minutes (600 seconds)
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
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      const savedTimeout = localStorage.getItem('inactivityTimeout');

      // Restore saved timeout if available
      if (savedTimeout) {
        setInactivityTimeout(parseInt(savedTimeout, 10));
      }

      if (token) {
        try {
          // Attempt to validate the token with the backend
          try {
            // Make a request to validate the token
            const response = await apiService.get('/auth/me');
            console.log('Auth validation response:', response);

            let userData;

            // Try to use user data from localStorage first
            if (userJson) {
              userData = JSON.parse(userJson);
            }
            // If no user data in localStorage, use the response from /auth/me
            else if (response && response.data && response.data.user) {
              userData = response.data.user;
            }
            // Fallback to a default user object if all else fails
            else {
              userData = {
                username: 'User',
                role: 'superadmin'
              };
            }

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
            console.log('User data set in AuthContext:', userData);

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
          } catch (apiError) {
            console.error('Token validation failed:', apiError);
            // Token is invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
        }
      } else {
        // No token, ensure user is null
        setUser(null);
      }

      setLoading(false);
    };

    validateToken();
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      // Connect to the backend API
      const response = await apiService.post('/auth/login', { username, password });
      console.log('Login response:', response);

      // Check if the response has the expected format
      if (response && response.status === 'success' && response.token) {
        // Extract user data from the nested structure if it exists
        const token = response.token;
        const user = response.data?.user || {};

        console.log('Extracted token and user:', { token, user });

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Set user state
        setUser(user);

        // Immediately validate the token to ensure it works
        try {
          const validateResponse = await apiService.get('/auth/validate');
          console.log('Token validation response:', validateResponse);

          if (validateResponse && validateResponse.status === 'success') {
            console.log('Token is valid, navigating to dashboard');
            navigate('/dashboard');
          } else {
            console.error('Token validation failed:', validateResponse);
            throw new Error('Token validation failed');
          }
        } catch (validationError) {
          console.error('Error validating token:', validationError);
          throw validationError;
        }
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
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

  // Determine authentication status from both user state and localStorage token
  const isAuthenticated = !!user || !!localStorage.getItem('token');

  const value = {
    user,
    loading,
    login,
    logout,
    changePassword,
    resetInactivityTimer,
    setInactivityTimeout: setInactivityTimeoutValue,
    isAuthenticated,
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
