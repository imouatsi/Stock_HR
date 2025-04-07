import { z } from 'zod';

export type UserRole = 'SU' | 'UA' | 'HR' | 'ACC' | 'MGR' | 'STK' | 'SLR';

export type Permission = 
  | 'hr:read' | 'hr:write' | 'hr:delete'
  | 'payroll:read' | 'payroll:write' | 'payroll:delete'
  | 'training:read' | 'training:write' | 'training:delete'
  | 'leave:read' | 'leave:write' | 'leave:delete'
  | 'performance:read' | 'performance:write' | 'performance:delete'
  | 'accounting:read' | 'accounting:write' | 'accounting:delete'
  | 'inventory:read' | 'inventory:write' | 'inventory:delete'
  | 'reports:read' | 'reports:write' | 'reports:delete';

export interface Role {
  id: string;
  code: UserRole;
  name: string;
  permissions: Permission[];
  description: string;
  isActive: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  role: UserRole;
  employeeId: string;
  isActive: boolean;
  isAuthorized: boolean;
  authorizedBy?: string;
  authorizedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
  phone: string;
  address: string;
  dateOfBirth: string;
  hireDate: string;
  departmentId: string;
  positionId: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: {
    id: string;
    type: string;
    url: string;
    uploadDate: string;
  }[];
  userAccount?: UserAccount;
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    validationErrors?: ValidationError[];
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type Language = 'ar' | 'fr' | 'en';

export interface LocalizedString {
  ar: string;
  fr: string;
  en: string;
}

export const ClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  address: z.string().min(1, 'Client address is required'),
  nif: z.string().optional(),
});

export const DocumentItemSchema = z.object({
  description: z.string().min(1, 'Item description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  barcode: z.string().optional(),
});

export const DocumentSchema = z.object({
  type: z.enum(['proforma', 'final']),
  client: ClientSchema,
  items: z.array(DocumentItemSchema).min(1, 'At least one item is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  dueDate: z.date().min(new Date(), 'Due date must be in the future'),
  signature: z.string().optional(),
  qrCode: z.string().optional(),
  status: z.enum(['draft', 'pending', 'approved', 'rejected']).default('draft'),
});

export type Client = z.infer<typeof ClientSchema>;
export type DocumentItem = z.infer<typeof DocumentItemSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type DocumentType = Document['type'];
export type DocumentStatus = Document['status']; 