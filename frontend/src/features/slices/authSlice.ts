import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// filepath: c:\Stock_HR\frontend\src\features\slices\authSlice.ts
interface User {
    // ...existing code...
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

const initialState: AuthState = {
  user: (() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  })(),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

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
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
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
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;