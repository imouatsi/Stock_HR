import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../features/store';
import { setLanguage } from '../features/language/languageSlice';

export const useLanguage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentLanguage } = useSelector((state: RootState) => state.language);

  const changeLanguage = (language: string) => {
    dispatch(setLanguage(language));
  };

  return {
    currentLanguage,
    changeLanguage,
  };
}; 