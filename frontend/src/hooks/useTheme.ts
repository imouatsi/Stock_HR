import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../features/store';
import { toggleTheme } from '../features/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const toggleThemeMode = () => {
    dispatch(toggleTheme());
  };

  return {
    isDarkMode,
    toggleTheme: toggleThemeMode,
  };
}; 