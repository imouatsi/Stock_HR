import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api.service';

interface AnalyticsData {
  totalStockValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalItems: number;
  stockMovement: Array<{
    date: string;
    quantity: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    value: number;
  }>;
  topMovingItems: Array<{
    id: string;
    name: string;
    movement: number;
    currentStock: number;
    unit: string;
  }>;
}

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/analytics/dashboard');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch analytics data'
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 