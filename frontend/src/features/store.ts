import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import inventoryReducer from './slices/inventorySlice';
import contractReducer from './slices/contractSlice';
import invoiceReducer from './slices/invoiceSlice';
import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    contracts: contractReducer,
    invoices: invoiceReducer,
    users: userReducer,
    settings: settingsReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 