import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier: string;
  lastUpdated: string;
}

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  selectedItem: InventoryItem | null;
}

const initialState: InventoryState = {
  items: [],
  isLoading: false,
  error: null,
  selectedItem: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    fetchItemsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchItemsSuccess: (state, action: PayloadAction<InventoryItem[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    fetchItemsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addItemStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addItemSuccess: (state, action: PayloadAction<InventoryItem>) => {
      state.isLoading = false;
      state.items.push(action.payload);
    },
    addItemFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateItemStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateItemSuccess: (state, action: PayloadAction<InventoryItem>) => {
      state.isLoading = false;
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateItemFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteItemStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteItemSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    deleteItemFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<InventoryItem | null>) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchItemsStart,
  fetchItemsSuccess,
  fetchItemsFailure,
  addItemStart,
  addItemSuccess,
  addItemFailure,
  updateItemStart,
  updateItemSuccess,
  updateItemFailure,
  deleteItemStart,
  deleteItemSuccess,
  deleteItemFailure,
  setSelectedItem,
  clearError,
} = inventorySlice.actions;

export default inventorySlice.reducer; 