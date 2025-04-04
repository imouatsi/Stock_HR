import api from './api';

export interface Contract {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxNumber?: string;
  };
  terms: string;
  type: 'sale' | 'purchase' | 'service' | 'maintenance';
  party: {
    name: string;
    type: 'individual' | 'company';
    contact: string;
    address: string;
  };
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  signature?: {
    date: string;
    signedBy: string;
    digitalSignature: string;
  };
  payments?: {
    id: string;
    amount: number;
    date: string;
    method: 'cash' | 'bank_transfer' | 'check';
    reference?: string;
    status: 'pending' | 'completed' | 'failed';
  }[];
  history?: {
    action: string;
    date: string;
    user: string;
    details?: string;
  }[];
}

export interface ContractTemplate {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxNumber?: string;
  };
  terms: string;
  type: 'sale' | 'purchase' | 'service' | 'maintenance';
  party: {
    name: string;
    type: 'individual' | 'company';
    contact: string;
    address: string;
  };
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  payments?: {
    scheduledDate: string;
    amount: number;
    method: 'cash' | 'bank_transfer' | 'check';
  }[];
}

export interface LicenseValidation {
  motherboardSN: string;
  hardDriveSN: string;
  activationKey: string;
}

export interface ApiError extends Error {
  code?: string;
  status?: number;
  details?: any;
}

interface ApiResponse<T> {
  status: string;
  data: {
    contracts?: T[];
    contract?: T;
  };
}

class ContractService {
  private static instance: ContractService;

  private constructor() {}

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  public async getAllContracts(): Promise<Contract[]> {
    try {
      const response = await api.get<ApiResponse<Contract>>('/contracts');
      return response.data.data.contracts || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getContractById(id: string): Promise<Contract> {
    try {
      const response = await api.get<ApiResponse<Contract>>(`/contracts/${id}`);
      if (!response.data.data.contract) {
        throw new Error('Contract not found');
      }
      return response.data.data.contract;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async createContract(contract: Omit<Contract, 'id'>): Promise<Contract> {
    try {
      const response = await api.post<ApiResponse<Contract>>('/contracts', contract);
      if (!response.data.data.contract) {
        throw new Error('Failed to create contract');
      }
      return response.data.data.contract;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async updateContract(id: string, contract: Partial<Contract>): Promise<Contract> {
    try {
      const response = await api.put<ApiResponse<Contract>>(`/contracts/${id}`, contract);
      if (!response.data.data.contract) {
        throw new Error('Failed to update contract');
      }
      return response.data.data.contract;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async deleteContract(id: string): Promise<void> {
    try {
      await api.delete(`/contracts/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async updateContractStatus(id: string, status: Contract['status']): Promise<Contract> {
    try {
      const response = await api.patch<ApiResponse<Contract>>(`/contracts/${id}/status`, { status });
      if (!response.data.data.contract) {
        throw new Error('Failed to update contract status');
      }
      return response.data.data.contract;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async generateContract(contract: ContractTemplate): Promise<Blob> {
    try {
      const response = await api.post<Blob>('/contracts/generate', contract, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async validateLicense(data: LicenseValidation): Promise<boolean> {
    try {
      const response = await api.post('/license/validate', data);
      return response.data.valid;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    const apiError = new Error() as ApiError;
    if (error.response) {
      apiError.message = error.response.data.message || 'An error occurred';
      apiError.code = error.response.data.code;
      apiError.status = error.response.status;
      apiError.details = error.response.data.details;
    } else {
      apiError.message = 'Network error occurred';
      apiError.code = 'NETWORK_ERROR';
    }
    return apiError;
  }
}

export default ContractService.getInstance();