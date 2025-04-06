import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return {
    t,
    i18n,
    changeLanguage,
  };
}; 