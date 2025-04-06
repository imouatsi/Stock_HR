import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleTheme, setTheme } from '../store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const toggleThemeMode = () => {
    dispatch(toggleTheme());
  };

  const setThemeMode = (isDark: boolean) => {
    dispatch(setTheme(isDark));
  };

  return {
    isDarkMode,
    toggleTheme: toggleThemeMode,
    setTheme: setThemeMode,
  };
}; 