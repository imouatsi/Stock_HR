import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Contract {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  type: 'employment' | 'supplier' | 'client';
  party: {
    name: string;
    type: 'individual' | 'company';
    contact: string;
    address: string;
  };
  terms: {
    payment: string;
    deliverables: string[];
    conditions: string[];
  };
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface ContractState {
  contracts: Contract[];
  isLoading: boolean;
  error: string | null;
  selectedContract: Contract | null;
}

const initialState: ContractState = {
  contracts: [],
  isLoading: false,
  error: null,
  selectedContract: null,
};

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    fetchContractsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchContractsSuccess: (state, action: PayloadAction<Contract[]>) => {
      state.isLoading = false;
      state.contracts = action.payload;
    },
    fetchContractsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addContractStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addContractSuccess: (state, action: PayloadAction<Contract>) => {
      state.isLoading = false;
      state.contracts.push(action.payload);
    },
    addContractFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateContractStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateContractSuccess: (state, action: PayloadAction<Contract>) => {
      state.isLoading = false;
      const index = state.contracts.findIndex((contract) => contract.id === action.payload.id);
      if (index !== -1) {
        state.contracts[index] = action.payload;
      }
    },
    updateContractFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteContractStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteContractSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.contracts = state.contracts.filter((contract) => contract.id !== action.payload);
    },
    deleteContractFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedContract: (state, action: PayloadAction<Contract | null>) => {
      state.selectedContract = action.payload;
    },
    updateContractStatus: (state, action: PayloadAction<{ id: string; status: Contract['status'] }>) => {
      const contract = state.contracts.find((c) => c.id === action.payload.id);
      if (contract) {
        contract.status = action.payload.status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchContractsStart,
  fetchContractsSuccess,
  fetchContractsFailure,
  addContractStart,
  addContractSuccess,
  addContractFailure,
  updateContractStart,
  updateContractSuccess,
  updateContractFailure,
  deleteContractStart,
  deleteContractSuccess,
  deleteContractFailure,
  setSelectedContract,
  updateContractStatus,
  clearError,
} = contractSlice.actions;

export default contractSlice.reducer;