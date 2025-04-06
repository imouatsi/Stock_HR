export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  settings?: {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
  };
} 