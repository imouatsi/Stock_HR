import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const loadLanguage = () => {
  try {
    const settings = localStorage.getItem('settings');
    if (settings) {
      const { language } = JSON.parse(settings);
      return language;
    }
  } catch (error) {
    console.error('Failed to load language setting:', error);
  }
  return 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: loadLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    }
  });

// Set initial direction
document.dir = loadLanguage() === 'ar' ? 'rtl' : 'ltr';

export default i18n;
