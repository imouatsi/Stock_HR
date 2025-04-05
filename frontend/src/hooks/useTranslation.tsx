import React, { useContext, createContext } from 'react';

// Simple translations
const translations: Record<string, Record<string, Record<string, string>>> = {
  en: {
    common: {
      noData: 'No data available',
      appName: 'Stock & HR',
      appTitle: 'Stock & HR Management System',
      logout: 'Logout',
      openMenu: 'Open Menu',
      noNotifications: 'No new notifications',
      delete: 'Delete',
      edit: 'Edit',
      download: 'Download',
      actions: 'Actions',
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      loading: 'Loading...',
      expand: 'Expand details',
      collapse: 'Collapse details'
    },
    login: {
      title: 'Sign In',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      invalidCredentials: 'Invalid email or password'
    },
    menu: {
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      contracts: 'Contracts',
      invoices: 'Invoices',
      proforma: 'Proforma',
      users: 'Users',
      settings: 'Settings'
    },
    roles: {
      superadmin: 'Super Admin',
      admin: 'Admin',
      manager: 'Manager',
      inventory_clerk: 'Inventory Clerk'
    },
    contracts: {
      title: 'Contracts',
      generateButton: 'Generate Contract',
      generateContract: 'Generate Contract',
      number: 'Contract Number',
      type: 'Contract Type',
      contractType: 'Contract Type',
      partyA: 'Party A',
      partyB: 'Party B',
      value: 'Contract Value',
      status: 'Status',
      name: 'Name',
      address: 'Address',
      contactPerson: 'Contact Person',
      email: 'Email',
      phone: 'Phone',
      terms: 'Terms & Conditions',
      startDate: 'Start Date',
      endDate: 'End Date',
      submit: 'Submit',
      cancel: 'Cancel',
      draft: 'Draft',
      active: 'Active',
      expired: 'Expired',
      terminated: 'Terminated'
    },
    invoices: {
      title: 'Invoices',
      addButton: 'Add Invoice',
      addInvoice: 'Add Invoice',
      number: 'Invoice Number',
      customer: 'Customer',
      customerName: 'Customer Name',
      total: 'Total',
      status: 'Status',
      dueDate: 'Due Date',
      item: 'Item',
      description: 'Description',
      quantity: 'Quantity',
      price: 'Price',
      tax: 'Tax',
      addItem: 'Add Item',
      details: 'Invoice Details',
      confirmDelete: 'Are you sure you want to delete this invoice?',
      paid: 'Paid',
      pending: 'Pending',
      overdue: 'Overdue',
      draft: 'Draft'
    },
    users: {
      title: 'Users',
      addButton: 'Add User'
    },
    settings: {
      title: 'Settings',
      darkMode: 'Dark Mode',
      enableNotifications: 'Enable Notifications'
    },
    inventory: {
      title: 'Inventory Management',
      addItem: 'Add Item',
      name: 'Item Name',
      quantity: 'Quantity',
      unit: 'Unit',
      price: 'Price',
      status: 'Status',
      description: 'Description',
      supplier: 'Supplier',
      lastUpdated: 'Last Updated',
      details: 'Item Details',
      confirmDelete: 'Are you sure you want to delete this item?',
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
    },
    dashboard: {
      title: 'Dashboard',
      revenue: 'Revenue',
      users: 'Users',
      inventory: 'Inventory',
      contracts: 'Contracts',
      fromLastMonth: 'from last month',
      revenueChart: 'Revenue Chart',
      recentActivity: 'Recent Activity',
      chartPlaceholder: 'Chart will be displayed here',
      activityPlaceholder: 'Recent activities will be displayed here',
    },
    proforma: {
      title: 'Proforma Invoices',
      addButton: 'New Proforma Invoice',
      number: 'Invoice Number',
      date: 'Date',
      buyer: 'Buyer',
      totalAmount: 'Total Amount',
      status: 'Status',
      actions: 'Actions',
      sellerDetails: 'Seller Details',
      buyerDetails: 'Buyer Details',
      name: 'Name',
      address: 'Address',
      nif: 'NIF',
      rc: 'RC',
      ai: 'AI',
      iban: 'IBAN',
      bank: 'Bank',
      companyId: 'Company ID',
      items: 'Items',
      description: 'Description',
      quantity: 'Quantity',
      unitPrice: 'Unit Price',
      total: 'Total',
      vat: 'VAT (DZD)',
      addItem: 'Add Item',
      create: 'Create',
      draft: 'Draft',
      finalized: 'Finalized',
      confirmDelete: 'Are you sure you want to delete this proforma invoice?',
      details: 'Proforma Details'
    },
  },
  fr: {
    common: {
      noData: 'Aucune donnée disponible',
      appName: 'Stock & RH',
      appTitle: 'Système de Gestion Stock & RH',
      logout: 'Déconnexion',
      openMenu: 'Ouvrir le menu',
      noNotifications: 'Aucune nouvelle notification',
      delete: 'Supprimer',
      edit: 'Modifier',
      download: 'Télécharger',
      actions: 'Actions',
      submit: 'Soumettre',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      loading: 'Chargement...',
      expand: 'Afficher les détails',
      collapse: 'Masquer les détails'
    },
    login: {
      title: 'Connexion',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      signIn: 'Se connecter',
      invalidCredentials: 'Email ou mot de passe invalide'
    },
    menu: {
      dashboard: 'Tableau de bord',
      inventory: 'Inventaire',
      contracts: 'Contrats',
      invoices: 'Factures',
      proforma: 'Proforma',
      users: 'Utilisateurs',
      settings: 'Paramètres'
    },
    roles: {
      superadmin: 'Super Admin',
      admin: 'Administrateur',
      manager: 'Gestionnaire',
      inventory_clerk: 'Gestionnaire de stock'
    },
    contracts: {
      title: 'Contrats',
      generateButton: 'Générer un contrat',
      generateContract: 'Générer un contrat',
      number: 'Numéro de contrat',
      type: 'Type de contrat',
      contractType: 'Type de contrat',
      partyA: 'Partie A',
      partyB: 'Partie B',
      value: 'Valeur du contrat',
      status: 'Statut',
      name: 'Nom',
      address: 'Adresse',
      contactPerson: 'Personne à contacter',
      email: 'Email',
      phone: 'Téléphone',
      terms: 'Termes et conditions',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      submit: 'Soumettre',
      cancel: 'Annuler',
      draft: 'Brouillon',
      active: 'Actif',
      expired: 'Expiré',
      terminated: 'Résilié'
    },
    invoices: {
      title: 'Factures',
      addButton: 'Ajouter une facture',
      addInvoice: 'Ajouter une facture',
      number: 'Numéro de facture',
      customer: 'Client',
      customerName: 'Nom du client',
      total: 'Total',
      status: 'Statut',
      dueDate: 'Date d\'échéance',
      item: 'Article',
      description: 'Description',
      quantity: 'Quantité',
      price: 'Prix',
      tax: 'Taxe',
      addItem: 'Ajouter un article',
      details: 'Détails de la facture',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette facture ?',
      paid: 'Payée',
      pending: 'En attente',
      overdue: 'En retard',
      draft: 'Brouillon'
    },
    users: {
      title: 'Utilisateurs',
      addButton: 'Ajouter un utilisateur'
    },
    settings: {
      title: 'Paramètres',
      darkMode: 'Mode sombre',
      enableNotifications: 'Activer les notifications'
    },
    inventory: {
      title: 'Gestion des Stocks',
      addItem: 'Ajouter un Article',
      name: 'Nom de l\'Article',
      quantity: 'Quantité',
      unit: 'Unité',
      price: 'Prix',
      status: 'Statut',
      description: 'Description',
      supplier: 'Fournisseur',
      lastUpdated: 'Dernière Mise à Jour',
      details: 'Détails de l\'Article',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet article ?',
      in_stock: 'En Stock',
      low_stock: 'Stock Faible',
      out_of_stock: 'Rupture de Stock',
    },
    dashboard: {
      title: 'Tableau de Bord',
      revenue: 'Revenu',
      users: 'Utilisateurs',
      inventory: 'Inventaire',
      contracts: 'Contrats',
      fromLastMonth: 'par rapport au mois dernier',
      revenueChart: 'Graphique des Revenus',
      recentActivity: 'Activité Récente',
      chartPlaceholder: 'Le graphique sera affiché ici',
      activityPlaceholder: 'Les activités récentes seront affichées ici',
    },
    proforma: {
      title: 'Factures Proforma',
      addButton: 'Nouvelle Facture Proforma',
      number: 'Numéro de Facture',
      date: 'Date',
      buyer: 'Acheteur',
      totalAmount: 'Montant Total',
      status: 'Statut',
      actions: 'Actions',
      sellerDetails: 'Détails du Vendeur',
      buyerDetails: 'Détails de l\'Acheteur',
      name: 'Nom',
      address: 'Adresse',
      nif: 'NIF',
      rc: 'RC',
      ai: 'AI',
      iban: 'IBAN',
      bank: 'Banque',
      companyId: 'ID de l\'Entreprise',
      items: 'Articles',
      description: 'Description',
      quantity: 'Quantité',
      unitPrice: 'Prix Unitaire',
      total: 'Total',
      vat: 'TVA (DZD)',
      addItem: 'Ajouter un Article',
      create: 'Créer',
      draft: 'Brouillon',
      finalized: 'Finalisée',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette facture proforma ?',
      details: 'Détails de la Facture Proforma'
    },
  },
  ar: {
    common: {
      noData: 'لا توجد بيانات متاحة',
      appName: 'المخزون والموارد البشرية',
      appTitle: 'نظام إدارة المخزون والموارد البشرية',
      logout: 'تسجيل الخروج',
      openMenu: 'فتح القائمة',
      noNotifications: 'لا توجد إشعارات جديدة',
      delete: 'حذف',
      edit: 'تعديل',
      download: 'تحميل',
      actions: 'إجراءات',
      submit: 'إرسال',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      loading: 'جاري التحميل...',
      expand: 'عرض التفاصيل',
      collapse: 'إخفاء التفاصيل'
    },
    login: {
      title: 'تسجيل الدخول',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signIn: 'دخول',
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    },
    menu: {
      dashboard: 'لوحة التحكم',
      inventory: 'المخزون',
      contracts: 'العقود',
      invoices: 'الفواتير',
      proforma: 'فاتورة أولية',
      users: 'المستخدمين',
      settings: 'الإعدادات'
    },
    roles: {
      superadmin: 'مدير النظام',
      admin: 'مدير',
      manager: 'مشرف',
      inventory_clerk: 'موظف المخزون'
    },
    contracts: {
      title: 'العقود',
      generateButton: 'إنشاء عقد',
      generateContract: 'إنشاء عقد',
      number: 'رقم العقد',
      type: 'نوع العقد',
      contractType: 'نوع العقد',
      partyA: 'الطرف الأول',
      partyB: 'الطرف الثاني',
      value: 'قيمة العقد',
      status: 'الحالة',
      name: 'الاسم',
      address: 'العنوان',
      contactPerson: 'الشخص المسؤول',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      terms: 'الشروط والأحكام',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      submit: 'إرسال',
      cancel: 'إلغاء',
      draft: 'مسودة',
      active: 'نشط',
      expired: 'منتهي',
      terminated: 'منتهي'
    },
    invoices: {
      title: 'الفواتير',
      addButton: 'إضافة فاتورة',
      addInvoice: 'إضافة فاتورة',
      number: 'رقم الفاتورة',
      customer: 'العميل',
      customerName: 'اسم العميل',
      total: 'المجموع',
      status: 'الحالة',
      dueDate: 'تاريخ الاستحقاق',
      item: 'العنصر',
      description: 'الوصف',
      quantity: 'الكمية',
      price: 'السعر',
      tax: 'الضريبة',
      addItem: 'إضافة عنصر',
      details: 'تفاصيل الفاتورة',
      confirmDelete: 'هل أنت متأكد أنك تريد حذف هذه الفاتورة؟',
      paid: 'مدفوعة',
      pending: 'معلقة',
      overdue: 'متأخرة',
      draft: 'مسودة'
    },
    users: {
      title: 'المستخدمين',
      addButton: 'إضافة مستخدم'
    },
    settings: {
      title: 'الإعدادات',
      darkMode: 'الوضع الداكن',
      enableNotifications: 'تفعيل الإشعارات'
    },
    inventory: {
      title: 'إدارة المخزون',
      addItem: 'إضافة عنصر',
      name: 'اسم العنصر',
      quantity: 'الكمية',
      unit: 'الوحدة',
      price: 'السعر',
      status: 'الحالة',
      description: 'الوصف',
      supplier: 'المورد',
      lastUpdated: 'آخر تحديث',
      details: 'تفاصيل العنصر',
      confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟',
      in_stock: 'متوفر',
      low_stock: 'مخزون منخفض',
      out_of_stock: 'نفذ المخزون',
    },
    dashboard: {
      title: 'لوحة التحكم',
      revenue: 'الإيرادات',
      users: 'المستخدمون',
      inventory: 'المخزون',
      contracts: 'العقود',
      fromLastMonth: 'مقارنة بالشهر الماضي',
      revenueChart: 'رسم بياني للإيرادات',
      recentActivity: 'النشاط الأخير',
      chartPlaceholder: 'سيتم عرض الرسم البياني هنا',
      activityPlaceholder: 'سيتم عرض الأنشطة الأخيرة هنا',
    },
    proforma: {
      title: 'فواتير أولية',
      addButton: 'فاتورة أولية جديدة',
      number: 'رقم الفاتورة',
      date: 'التاريخ',
      buyer: 'المشتري',
      totalAmount: 'المبلغ الإجمالي',
      status: 'الحالة',
      actions: 'الإجراءات',
      sellerDetails: 'تفاصيل البائع',
      buyerDetails: 'تفاصيل المشتري',
      name: 'الاسم',
      address: 'العنوان',
      nif: 'الرقم الضريبي',
      rc: 'السجل التجاري',
      ai: 'رقم التعريف',
      iban: 'رقم الحساب البنكي',
      bank: 'البنك',
      companyId: 'معرف الشركة',
      items: 'العناصر',
      description: 'الوصف',
      quantity: 'الكمية',
      unitPrice: 'سعر الوحدة',
      total: 'المجموع',
      vat: 'ضريبة القيمة المضافة (دينار جزائري)',
      addItem: 'إضافة عنصر',
      create: 'إنشاء',
      draft: 'مسودة',
      finalized: 'نهائية',
      confirmDelete: 'هل أنت متأكد أنك تريد حذف هذه الفاتورة الأولية؟',
      details: 'تفاصيل الفاتورة الأولية'
    },
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