import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Inventory', 'Analytics'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Inventory endpoints
    getInventory: builder.query({
      query: () => 'inventory',
      providesTags: ['Inventory'],
    }),
    updateInventory: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `inventory/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Inventory'],
    }),

    // Analytics endpoints
    getDashboardStats: builder.query({
      query: () => 'analytics/dashboard',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useGetDashboardStatsQuery,
} = api;
