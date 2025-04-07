import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../config';

interface NotificationSettings {
  email: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
  };
  browser: boolean;
  sound: boolean;
  desktop: boolean;
}

interface Settings {
  language: string;
  theme: 'light' | 'dark';
  currency: string;
  dateFormat: string;
  timeFormat: string;
  notifications: NotificationSettings;
  autoLogout: number; // in minutes
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    contrast: 'normal' | 'high';
    animations: boolean;
  };
  workspace: {
    defaultView: 'grid' | 'list';
    defaultLanguage: 'en' | 'fr' | 'ar';
    startPage: string;
  };
  security: {
    sessionTimeout: number;
    mfaEnabled: boolean;
    autoLock: boolean;
    lastSeen: boolean;
  };
}

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
}

const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return {
    language: DEFAULT_LANGUAGE,
    theme: 'light',
    currency: 'DZD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    notifications: {
      email: {
        security: true,
        updates: true,
        marketing: true,
      },
      browser: true,
      sound: true,
      desktop: true,
    },
    autoLogout: 30,
    accessibility: {
      fontSize: 'medium',
      contrast: 'normal',
      animations: true,
    },
    workspace: {
      defaultView: 'grid',
      defaultLanguage: 'en',
      startPage: '/dashboard',
    },
    security: {
      sessionTimeout: 30,
      mfaEnabled: true,
      autoLock: true,
      lastSeen: true,
    },
  };
};

const initialState: SettingsState = {
  settings: loadSettings(),
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
        localStorage.setItem('settings', JSON.stringify(state.settings));
      }
    },
    toggleTheme: (state) => {
      state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateCurrency: (state, action: PayloadAction<string>) => {
      state.settings.currency = action.payload;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateDateFormat: (state, action: PayloadAction<string>) => {
      state.settings.dateFormat = action.payload;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateTimeFormat: (state, action: PayloadAction<string>) => {
      state.settings.timeFormat = action.payload;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<Settings['notifications']>>
    ) => {
      state.settings.notifications = {
        ...state.settings.notifications,
        ...action.payload,
      };
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateAutoLogout: (state, action: PayloadAction<number>) => {
      state.settings.autoLogout = action.payload;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateAccessibility: (state, action: PayloadAction<Partial<Settings['accessibility']>>) => {
      state.settings.accessibility = {
        ...state.settings.accessibility,
        ...action.payload
      };
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateWorkspace: (state, action: PayloadAction<Partial<Settings['workspace']>>) => {
      state.settings.workspace = {
        ...state.settings.workspace,
        ...action.payload
      };
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateSecurity: (state, action: PayloadAction<Partial<Settings['security']>>) => {
      state.settings.security = {
        ...state.settings.security,
        ...action.payload
      };
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    clearError: (state) => {
      state.error = null;
    },
    updateSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
      localStorage.setItem('settings', JSON.stringify(action.payload));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
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
  updateAccessibility,
  updateWorkspace,
  updateSecurity,
  clearError,
  updateSettings,
  setLoading,
  setError,
} = settingsSlice.actions;

export default settingsSlice.reducer;