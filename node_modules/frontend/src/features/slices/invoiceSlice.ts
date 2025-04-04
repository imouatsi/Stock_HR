import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  description?: string;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  client: {
    name: string;
    address: string;
    taxNumber?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  terms?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface InvoiceState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  selectedInvoice: Invoice | null;
}

const initialState: InvoiceState = {
  invoices: [],
  isLoading: false,
  error: null,
  selectedInvoice: null,
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    fetchInvoicesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchInvoicesSuccess: (state, action: PayloadAction<Invoice[]>) => {
      state.isLoading = false;
      state.invoices = action.payload;
    },
    fetchInvoicesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addInvoiceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addInvoiceSuccess: (state, action: PayloadAction<Invoice>) => {
      state.isLoading = false;
      state.invoices.push(action.payload);
    },
    addInvoiceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateInvoiceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateInvoiceSuccess: (state, action: PayloadAction<Invoice>) => {
      state.isLoading = false;
      const index = state.invoices.findIndex((invoice) => invoice.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    updateInvoiceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteInvoiceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteInvoiceSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.invoices = state.invoices.filter((invoice) => invoice.id !== action.payload);
    },
    deleteInvoiceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload;
    },
    updateInvoiceStatus: (state, action: PayloadAction<{ id: string; status: Invoice['status'] }>) => {
      const invoice = state.invoices.find((i) => i.id === action.payload.id);
      if (invoice) {
        invoice.status = action.payload.status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchInvoicesStart,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  addInvoiceStart,
  addInvoiceSuccess,
  addInvoiceFailure,
  updateInvoiceStart,
  updateInvoiceSuccess,
  updateInvoiceFailure,
  deleteInvoiceStart,
  deleteInvoiceSuccess,
  deleteInvoiceFailure,
  setSelectedInvoice,
  updateInvoiceStatus,
  clearError,
} = invoiceSlice.actions;

export default invoiceSlice.reducer; 