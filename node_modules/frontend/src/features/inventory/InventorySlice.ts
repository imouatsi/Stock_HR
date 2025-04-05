import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api/apiSlice';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  lastUpdated: Date;
}

interface InventoryState {
  filters: {
    category: string | null;
    search: string;
    sortBy: 'name' | 'quantity' | 'price';
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: InventoryState = {
  filters: {
    category: null,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  }
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { setFilters, resetFilters } = inventorySlice.actions;
export default inventorySlice.reducer;
