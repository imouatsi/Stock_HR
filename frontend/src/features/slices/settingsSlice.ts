import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../config';

interface Settings {
  language: string;
  theme: 'light' | 'dark';
  currency: string;
  dateFormat: string;
  timeFormat: string;
  notifications: {
    email: boolean;
    browser: boolean;
    sound: boolean;
  };
  autoLogout: number; // in minutes
}

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    language: DEFAULT_LANGUAGE,
    theme: 'light',
    currency: 'DZD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    notifications: {
      email: true,
      browser: true,
      sound: true,
    },
    autoLogout: 30,
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    fetchSettingsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSettingsSuccess: (state, action: PayloadAction<Settings>) => {
      state.isLoading = false;
      state.settings = action.payload;
    },
    fetchSettingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      if (SUPPORTED_LANGUAGES.includes(action.payload)) {
        state.settings.language = action.payload;
      }
    },
    toggleTheme: (state) => {
      state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
    },
    updateCurrency: (state, action: PayloadAction<string>) => {
      state.settings.currency = action.payload;
    },
    updateDateFormat: (state, action: PayloadAction<string>) => {
      state.settings.dateFormat = action.payload;
    },
    updateTimeFormat: (state, action: PayloadAction<string>) => {
      state.settings.timeFormat = action.payload;
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<Settings['notifications']>>
    ) => {
      state.settings.notifications = {
        ...state.settings.notifications,
        ...action.payload,
      };
    },
    updateAutoLogout: (state, action: PayloadAction<number>) => {
      state.settings.autoLogout = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchSettingsStart,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateLanguage,
  toggleTheme,
  updateCurrency,
  updateDateFormat,
  updateTimeFormat,
  updateNotificationSettings,
  updateAutoLogout,
  clearError,
} = settingsSlice.actions;

export default settingsSlice.reducer; 