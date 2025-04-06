import { api } from './api';

export interface AccessToken {
  token: string;
  expiresAt: string;
}

class StockAccessTokenService {
  private static instance: StockAccessTokenService;
  private tokens: Map<string, AccessToken> = new Map();

  private constructor() {}

  public static getInstance(): StockAccessTokenService {
    if (!StockAccessTokenService.instance) {
      StockAccessTokenService.instance = new StockAccessTokenService();
    }
    return StockAccessTokenService.instance;
  }

  async requestAccessToken(
    inventoryItem: string,
    operation: 'sale' | 'transfer' | 'adjustment',
    quantity: number
  ): Promise<AccessToken | null> {
    try {
      const response = await api.post('/stock/access-tokens', {
        inventoryItem,
        operation,
        quantity
      });
      
      const token = response.data;
      this.tokens.set(inventoryItem, token);
      return token;
    } catch (error) {
      console.error('Failed to request access token:', error);
      return null;
    }
  }

  async releaseAccessToken(token: string): Promise<void> {
    try {
      await api.delete(`/stock/access-tokens/${token}`);
      // Find and remove the token from our map
      for (const [itemId, storedToken] of this.tokens.entries()) {
        if (storedToken.token === token) {
          this.tokens.delete(itemId);
          break;
        }
      }
    } catch (error) {
      console.error('Failed to release access token:', error);
    }
  }

  async cancelAccessToken(token: string): Promise<void> {
    try {
      await api.post(`/stock/access-tokens/${token}/cancel`);
      // Find and remove the token from our map
      for (const [itemId, storedToken] of this.tokens.entries()) {
        if (storedToken.token === token) {
          this.tokens.delete(itemId);
          break;
        }
      }
    } catch (error) {
      console.error('Failed to cancel access token:', error);
    }
  }

  getTokenForItem(inventoryItem: string): AccessToken | undefined {
    return this.tokens.get(inventoryItem);
  }
}

export const stockAccessTokenService = StockAccessTokenService.getInstance(); 