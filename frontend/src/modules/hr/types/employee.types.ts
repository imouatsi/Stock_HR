export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'SU' | 'UA' | 'U';
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
}

export interface EmployeeFormData extends Omit<Employee, 'id' | 'documents'> {
  documents?: File[];
}

export interface EmployeeFilters {
  departmentId?: string;
  positionId?: string;
  status?: Employee['status'];
  search?: string;
} 