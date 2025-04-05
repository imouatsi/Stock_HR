import React, { useContext, createContext } from 'react';

// Simple translations
const translations: Record<string, Record<string, Record<string, string>>> = {
  en: {
    common: {
      noData: 'No data available'
    },
    contracts: {
      title: 'Contracts',
      generateButton: 'Generate Contract'
    },
    invoices: {
      title: 'Invoices',
      addButton: 'Add Invoice'
    },
    users: {
      title: 'Users',
      addButton: 'Add User'
    },
    settings: {
      title: 'Settings',
      darkMode: 'Dark Mode',
      enableNotifications: 'Enable Notifications'
    }
  },
  fr: {
    common: {
      noData: 'Aucune donnée disponible'
    },
    contracts: {
      title: 'Contrats',
      generateButton: 'Générer un contrat'
    },
    invoices: {
      title: 'Factures',
      addButton: 'Ajouter une facture'
    },
    users: {
      title: 'Utilisateurs',
      addButton: 'Ajouter un utilisateur'
    },
    settings: {
      title: 'Paramètres',
      darkMode: 'Mode sombre',
      enableNotifications: 'Activer les notifications'
    }
  },
  ar: {
    common: {
      noData: 'لا توجد بيانات متاحة'
    },
    contracts: {
      title: 'العقود',
      generateButton: 'إنشاء عقد'
    },
    invoices: {
      title: 'الفواتير',
      addButton: 'إضافة فاتورة'
    },
    users: {
      title: 'المستخدمين',
      addButton: 'إضافة مستخدم'
    },
    settings: {
      title: 'الإعدادات',
      darkMode: 'الوضع الداكن',
      enableNotifications: 'تفعيل الإشعارات'
    }
  }
};

// Create a context for the current language
const LanguageContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
}>({
  language: 'en',
  setLanguage: () => {}
});

// Create a provider component
export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = React.useState(
    localStorage.getItem('language') || 'en'
  );

  // Update language and store in localStorage
  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a hook to use the translation
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  const { language, setLanguage } = context;
  
  // Simple translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    if (keys.length !== 2) return key;
    
    const section = keys[0];
    const translationKey = keys[1];
    
    const currentLang = language as keyof typeof translations;
    
    if (!translations[currentLang]) return key;
    if (!translations[currentLang][section]) return key;
    
    return translations[currentLang][section][translationKey] || key;
  };

  // Change language function that doesn't use hooks inside
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };
  
  return { t, i18n: { language, changeLanguage } };
};

export default useTranslation; 