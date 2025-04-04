export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const APP_NAME = 'Stock & HR Management System';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'];

export const DEFAULT_LANGUAGE = 'en';

export const CURRENCY = 'DZD';

export const DATE_FORMAT = 'DD/MM/YYYY';

export const TIME_FORMAT = 'HH:mm';

export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

export const FILE_UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  SELLER: 'seller',
  STOCK_CLERK: 'stock_clerk',
} as const;

export const PERMISSIONS = {
  // User management
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',

  // Inventory management
  CREATE_INVENTORY: 'create_inventory',
  READ_INVENTORY: 'read_inventory',
  UPDATE_INVENTORY: 'update_inventory',
  DELETE_INVENTORY: 'delete_inventory',

  // Contract management
  CREATE_CONTRACT: 'create_contract',
  READ_CONTRACT: 'read_contract',
  UPDATE_CONTRACT: 'update_contract',
  DELETE_CONTRACT: 'delete_contract',

  // Invoice management
  CREATE_INVOICE: 'create_invoice',
  READ_INVOICE: 'read_invoice',
  UPDATE_INVOICE: 'update_invoice',
  DELETE_INVOICE: 'delete_invoice',
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.SUPERADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.CREATE_INVENTORY,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.UPDATE_INVENTORY,
    PERMISSIONS.CREATE_CONTRACT,
    PERMISSIONS.READ_CONTRACT,
    PERMISSIONS.UPDATE_CONTRACT,
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.READ_INVOICE,
    PERMISSIONS.UPDATE_INVOICE,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.CREATE_INVENTORY,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.UPDATE_INVENTORY,
    PERMISSIONS.CREATE_CONTRACT,
    PERMISSIONS.READ_CONTRACT,
    PERMISSIONS.UPDATE_CONTRACT,
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.READ_INVOICE,
    PERMISSIONS.UPDATE_INVOICE,
  ],
  [ROLES.SELLER]: [
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.CREATE_CONTRACT,
    PERMISSIONS.READ_CONTRACT,
    PERMISSIONS.UPDATE_CONTRACT,
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.READ_INVOICE,
    PERMISSIONS.UPDATE_INVOICE,
  ],
  [ROLES.STOCK_CLERK]: [
    PERMISSIONS.CREATE_INVENTORY,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.UPDATE_INVENTORY,
  ],
} as const; 