export const ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SELLER: 'SELLER',
  STOCK_CLERK: 'STOCK_CLERK',
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
