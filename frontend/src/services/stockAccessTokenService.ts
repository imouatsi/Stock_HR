import api from './api';

export interface StockAccessToken {
  token: string;
  expiresAt: Date;
  operation: 'sale' | 'transfer' | 'adjustment';
  quantity: number;
  details?: {
    destination?: string;
    reason?: string;
  };
}

export interface StockAccessTokenRequest {
  inventoryItem: string;
  operation: 'sale' | 'transfer' | 'adjustment';
  quantity: number;
  details?: {
    destination?: string;
    reason?: string;
  };
}

class StockAccessTokenService {
  private activeTokens: Map<string, StockAccessToken> = new Map();
  private expirationTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Request an access token for a specific inventory item
   */
  async requestAccessToken(request: StockAccessTokenRequest): Promise<StockAccessToken> {
    try {
      const response = await api.post('/stock/access-token', request);
      const token = response.data.data.token;
      
      // Store the token
      this.activeTokens.set(request.inventoryItem, token);
      
      // Set up auto-expiration
      this.setupTokenExpiration(request.inventoryItem, token.expiresAt);
      
      return token;
    } catch (error) {
      console.error('Error requesting access token:', error);
      throw error;
    }
  }

  /**
   * Release an access token
   */
  async releaseAccessToken(token: string): Promise<void> {
    try {
      await api.post(`/stock/access-token/${token}/release`);
      
      // Find and remove the token from active tokens
      for (const [inventoryItem, activeToken] of this.activeTokens.entries()) {
        if (activeToken.token === token) {
          this.activeTokens.delete(inventoryItem);
          this.clearExpirationTimer(inventoryItem);
          break;
        }
      }
    } catch (error) {
      console.error('Error releasing access token:', error);
      throw error;
    }
  }

  /**
   * Cancel an access token
   */
  async cancelAccessToken(token: string): Promise<void> {
    try {
      await api.post(`/stock/access-token/${token}/cancel`);
      
      // Find and remove the token from active tokens
      for (const [inventoryItem, activeToken] of this.activeTokens.entries()) {
        if (activeToken.token === token) {
          this.activeTokens.delete(inventoryItem);
          this.clearExpirationTimer(inventoryItem);
          break;
        }
      }
    } catch (error) {
      console.error('Error canceling access token:', error);
      throw error;
    }
  }

  /**
   * Get the active access token for an inventory item
   */
  async getActiveAccessToken(inventoryItem: string): Promise<StockAccessToken | null> {
    try {
      // Check if we already have the token in memory
      if (this.activeTokens.has(inventoryItem)) {
        return this.activeTokens.get(inventoryItem)!;
      }
      
      // Otherwise, fetch it from the server
      const response = await api.get(`/stock/access-token/${inventoryItem}`);
      const token = response.data.data.token;
      
      // Store the token
      this.activeTokens.set(inventoryItem, token);
      
      // Set up auto-expiration
      this.setupTokenExpiration(inventoryItem, token.expiresAt);
      
      return token;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error('Error getting active access token:', error);
      throw error;
    }
  }

  /**
   * Check if an inventory item has an active access token
   */
  hasActiveToken(inventoryItem: string): boolean {
    return this.activeTokens.has(inventoryItem);
  }

  /**
   * Get the active token for an inventory item
   */
  getToken(inventoryItem: string): StockAccessToken | undefined {
    return this.activeTokens.get(inventoryItem);
  }

  /**
   * Set up auto-expiration for a token
   */
  private setupTokenExpiration(inventoryItem: string, expiresAt: Date): void {
    // Clear any existing timer
    this.clearExpirationTimer(inventoryItem);
    
    // Calculate time until expiration
    const expirationTime = new Date(expiresAt).getTime() - Date.now();
    
    if (expirationTime > 0) {
      // Set up a timer to remove the token when it expires
      const timer = setTimeout(() => {
        this.activeTokens.delete(inventoryItem);
        this.expirationTimers.delete(inventoryItem);
      }, expirationTime);
      
      this.expirationTimers.set(inventoryItem, timer);
    } else {
      // Token is already expired
      this.activeTokens.delete(inventoryItem);
    }
  }

  /**
   * Clear the expiration timer for an inventory item
   */
  private clearExpirationTimer(inventoryItem: string): void {
    const timer = this.expirationTimers.get(inventoryItem);
    if (timer) {
      clearTimeout(timer);
      this.expirationTimers.delete(inventoryItem);
    }
  }
}

// Export a singleton instance
export const stockAccessTokenService = new StockAccessTokenService(); 