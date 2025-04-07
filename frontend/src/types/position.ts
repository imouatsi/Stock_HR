export interface Position {
  id: string;
  title: string;
  description?: string;
  departmentId: string;
  minSalary: number;
  maxSalary: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type PositionFormData = Omit<Position, 'id' | 'createdAt' | 'updatedAt'>; 