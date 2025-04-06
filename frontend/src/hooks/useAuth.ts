import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../features/store';
import { login, logout, clearError } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    return dispatch(login(credentials));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    clearError: clearAuthError,
  };
}; 