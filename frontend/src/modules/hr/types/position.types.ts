export interface Position {
  id: string;
  title: string;
  code: string;
  departmentId: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PositionFormData extends Omit<Position, 'id' | 'createdAt' | 'updatedAt'> {}

export interface PositionFilters {
  departmentId?: string;
  status?: Position['status'];
  search?: string;
} 