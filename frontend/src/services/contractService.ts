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
  type: string;
  party: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
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

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data.message || 'An error occurred';
      return new Error(message);
    }
    return new Error('Network error occurred');
  }
}

export default ContractService.getInstance(); 