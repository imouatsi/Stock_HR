export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export type DepartmentFormData = Omit<Department, 'id' | 'createdAt' | 'updatedAt'>; 