import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  settings?: {
    workspace?: {
      analytics?: {
        kpis?: {
          performance?: {
            skillMatrix?: {
              technical: Array<{ skill: string; level: number; growth: number }>;
            };
            aiPredictions?: {
              nextMonthPerformance: number;
              burnoutRisk: string;
              recommendedActions: string[];
            };
          };
          dailyTasks?: {
            completed: number;
            total: number;
            efficiency: number;
          };
        };
        gamification?: any;
        mostUsedFeatures?: Array<{ feature: string; useCount: number }>;
        productivityScore?: number;
      };
      collaboration?: {
        teams: Array<{ id: string; role: string }>;
      };
    };
  };
  subscription?: {
    features: string[];
  };
}

interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const loadState = (): AuthState => {
  try {
    const token = localStorage.getItem('token') || null;
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    return {
      token,
      user,
      loading: false,
      error: null,
    };
  } catch (error) {
    console.error('Failed to load auth state:', error);
    return {
      token: null,
      user: null,
      loading: false,
      error: null,
    };
  }
};

const initialState: AuthState = loadState();

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Login failed');
    }
    
    const data = await response.json();
    try {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    } catch (error) {
      console.error('Failed to save auth data to localStorage:', error);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  },
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Registration failed');
    }
    
    const data = await response.json();
    try {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    } catch (error) {
      console.error('Failed to save auth data to localStorage:', error);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to clear auth data from localStorage:', error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.token = null;
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 