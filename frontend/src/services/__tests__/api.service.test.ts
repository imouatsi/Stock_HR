import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import apiService from '../api.service';

describe('ApiService Integration Tests', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Create a new instance of axios-mock-adapter
    mock = new MockAdapter(axios);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Reset mock adapter and localStorage
    mock.reset();
    localStorage.clear();
  });

  describe('GET requests', () => {
    it('should successfully fetch data', async () => {
      const mockData = { data: { id: 1, name: 'Test' } };
      mock.onGet('/api/test').reply(200, { status: 'success', data: mockData });

      const response = await apiService.get('/test');
      expect(response.status).toBe('success');
      expect(response.data).toEqual(mockData);
    });

    it('should handle 404 errors', async () => {
      mock.onGet('/api/nonexistent').reply(404, {
        status: 'error',
        error: { message: 'Resource not found' }
      });

      await expect(apiService.get('/nonexistent')).rejects.toThrow('Resource not found');
    });

    it('should retry on network errors', async () => {
      let attempts = 0;
      mock.onGet('/api/flaky').reply(() => {
        attempts++;
        return attempts < 3 ? [500, { error: 'Server Error' }] : [200, { status: 'success', data: 'OK' }];
      });

      const response = await apiService.get('/flaky');
      expect(attempts).toBe(3);
      expect(response.status).toBe('success');
    });
  });

  describe('POST requests', () => {
    it('should successfully create data', async () => {
      const mockData = { name: 'Test' };
      mock.onPost('/api/test', mockData).reply(201, {
        status: 'success',
        data: { id: 1, ...mockData }
      });

      const response = await apiService.post('/test', mockData);
      expect(response.status).toBe('success');
      expect(response.data).toEqual({ id: 1, ...mockData });
    });

    it('should handle validation errors', async () => {
      const mockData = { name: '' };
      mock.onPost('/api/test', mockData).reply(400, {
        status: 'error',
        error: {
          message: 'Validation failed',
          validationErrors: [{ field: 'name', message: 'Name is required' }]
        }
      });

      await expect(apiService.post('/test', mockData)).rejects.toThrow('Validation failed');
    });
  });

  describe('Authentication', () => {
    it('should include JWT token in requests when available', async () => {
      const token = 'test-jwt-token';
      localStorage.setItem('token', token);

      mock.onGet('/api/protected', undefined, expect.objectContaining({
        Authorization: `Bearer ${token}`
      })).reply(200, { status: 'success', data: 'Protected data' });

      const response = await apiService.get('/protected');
      expect(response.status).toBe('success');
    });

    it('should handle unauthorized errors', async () => {
      mock.onGet('/api/protected').reply(401, {
        status: 'error',
        error: { message: 'Unauthorized access' }
      });

      await expect(apiService.get('/protected')).rejects.toThrow('Unauthorized access');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mock.onGet('/api/test').networkError();
      await expect(apiService.get('/test')).rejects.toThrow('No response received from server');
    });

    it('should handle timeout errors', async () => {
      mock.onGet('/api/test').timeout();
      await expect(apiService.get('/test')).rejects.toThrow();
    });

    it('should handle server errors', async () => {
      mock.onGet('/api/test').reply(500, {
        status: 'error',
        error: { message: 'Internal server error' }
      });

      await expect(apiService.get('/test')).rejects.toThrow('Internal server error');
    });
  });
}); 