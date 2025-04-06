export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
} 