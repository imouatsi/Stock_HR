import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
  items: InventoryItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    category: string | null;
    search: string;
    sortBy: 'name' | 'quantity' | 'price';
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: InventoryState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    category: null,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  }
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchItems',
  async () => {
    const response = await api.get('/inventory');
    return response.data;
  }
);

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // Reducer implementations
  },
  extraReducers: (builder) => {
    // Extra reducer implementations
  }
});

export default inventorySlice.reducer;
