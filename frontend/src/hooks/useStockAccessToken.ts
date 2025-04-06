import { useState, useEffect, useCallback } from 'react';
import { stockAccessTokenService, StockAccessToken, StockAccessTokenRequest } from '../services/stockAccessTokenService';

interface UseStockAccessTokenResult {
  token: StockAccessToken | null;
  isLoading: boolean;
  error: Error | null;
  requestToken: (request: StockAccessTokenRequest) => Promise<void>;
  releaseToken: () => Promise<void>;
  cancelToken: () => Promise<void>;
}

export const useStockAccessToken = (inventoryItem?: string): UseStockAccessTokenResult => {
  const [token, setToken] = useState<StockAccessToken | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Load active token if inventoryItem is provided
  useEffect(() => {
    const loadActiveToken = async () => {
      if (!inventoryItem) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const activeToken = await stockAccessTokenService.getActiveAccessToken(inventoryItem);
        setToken(activeToken);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load access token'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActiveToken();
  }, [inventoryItem]);

  // Request a new token
  const requestToken = useCallback(async (request: StockAccessTokenRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newToken = await stockAccessTokenService.requestAccessToken(request);
      setToken(newToken);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to request access token'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Release the current token
  const releaseToken = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await stockAccessTokenService.releaseAccessToken(token.token);
      setToken(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to release access token'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Cancel the current token
  const cancelToken = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await stockAccessTokenService.cancelAccessToken(token.token);
      setToken(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to cancel access token'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    token,
    isLoading,
    error,
    requestToken,
    releaseToken,
    cancelToken
  };
}; 