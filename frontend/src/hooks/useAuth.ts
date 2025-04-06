import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { authService } from '../services/authService';
import { loginStart, loginSuccess, loginFailure, logout, setProfile } from '../store/slices/authSlice';
import { LoginCredentials } from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(loginStart());
      const user = await authService.login(credentials);
      dispatch(loginSuccess(user));
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
    }
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const profile = await authService.getProfile();
      dispatch(setProfile(profile));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
    updateProfile,
  };
}; 