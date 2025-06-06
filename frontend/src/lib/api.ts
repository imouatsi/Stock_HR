import axios, { AxiosError, AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiResponse<T>(response: AxiosResponse): T {
  return response.data;
}

export function handleApiError(error: unknown): Error {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return new Error(error.response?.data?.message || error.message);
  }
  return error instanceof Error ? error : new Error('An unknown error occurred');
}

export default api;