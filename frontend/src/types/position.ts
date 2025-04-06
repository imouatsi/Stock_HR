export interface Position {
  id: string;
  title: string;
  department: string;
  level: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
} 