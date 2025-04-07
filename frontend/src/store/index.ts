import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { themeReducer } from './slices/themeSlice';
import { notificationReducer } from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 