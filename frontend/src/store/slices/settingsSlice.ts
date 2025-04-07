import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface SettingsState {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  notifications: true,
  theme: 'light',
  language: 'en',
  isLoading: false,
  error: null,
};

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Partial<SettingsState>, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings', settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.theme = action.payload.theme;
        state.language = action.payload.language;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError } = settingsSlice.actions;
export default settingsSlice.reducer; 