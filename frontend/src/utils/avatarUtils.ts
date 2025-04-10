/**
 * Maps user roles to their corresponding avatar image filenames
 */
export function getRoleAvatar(role?: string): string {
  if (!role) return 'superadmin.png';

  // Map role names to image filenames
  const roleImageMap: Record<string, string> = {
    'superadmin': 'superadmin.png',
    'admin': 'admin.png',
    'hr': 'hr.png',
    'accounting': 'accountant.png',
    'stock': 'stock_clerck.png',
    'stock_manager': 'stcok_manager.png', // Note: There's a typo in the filename
    'stock_clerk': 'stock_clerck.png',
    'stock_seller': 'stock_seller.png',
    'manager': 'admin.png', // Fallback to admin for manager
    'employee': 'admin.png', // Fallback to admin for employee
  };

  // Return the mapped image or default to superadmin if no mapping exists
  return roleImageMap[role.toLowerCase()] || 'superadmin.png';
}
