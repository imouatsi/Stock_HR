export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerId?: string;
  parentDepartmentId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentFormData extends Omit<Department, 'id' | 'createdAt' | 'updatedAt'> {}

export interface DepartmentFilters {
  status?: Department['status'];
  search?: string;
} 