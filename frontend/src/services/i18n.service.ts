import { Language, LocalizedString } from '@/types/core.types';

class I18nService {
  private currentLanguage: Language;
  private translations: Record<string, Record<Language, string>>;

  constructor() {
    this.currentLanguage = this.getDefaultLanguage();
    this.translations = {};
  }

  private getDefaultLanguage(): Language {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ar', 'fr', 'en'].includes(savedLanguage)) {
      return savedLanguage;
    }
    return 'ar'; // Default to Arabic
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  translate(key: string, params?: Record<string, string>): string {
    const translation = this.translations[key]?.[this.currentLanguage] || key;
    if (!params) return translation;

    return Object.entries(params).reduce(
      (result, [param, value]) => result.replace(`{${param}}`, value),
      translation
    );
  }

  translateLocalizedString(localizedString: LocalizedString): string {
    return localizedString[this.currentLanguage];
  }

  loadTranslations(translations: Record<string, Record<Language, string>>) {
    this.translations = translations;
  }
}

export const i18nService = new I18nService(); 