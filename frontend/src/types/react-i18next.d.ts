import 'react-i18next';
import en from '../locales/en.json';

// Define translation resources type
type Resources = {
  translation: typeof en;
};

// Extend the i18next declarations
declare module 'react-i18next' {
  // Extend the i18n interface
  interface CustomTypeOptions {
    // Custom resources
    resources: {
      en: Resources;
      fr: Resources;
      ar: Resources;
    };
  }

  // Override the TFunction to accept string keys
  interface TFunction {
    (key: string, options?: object): string;
  }
} 