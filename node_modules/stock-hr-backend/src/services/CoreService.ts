import { CacheService } from './CacheService';
import { WebSocketService } from './WebSocketService';
import { AuthService } from './AuthService';

export class CoreService {
  private static instance: CoreService;
  private cache: CacheService;
  private websocket: WebSocketService;
  private auth: AuthService;

  private constructor() {
    this.cache = CacheService.getInstance();
    this.auth = new AuthService();
  }

  public static getInstance(): CoreService {
    if (!CoreService.instance) {
      CoreService.instance = new CoreService();
    }
    return CoreService.instance;
  }

  public initializeWebSocket(server: any) {
    this.websocket = new WebSocketService(server);
  }

  // Core business logic methods
  public async processInventoryUpdate(data: any) {
    // Cache the update
    await this.cache.set(`inventory:${data.id}`, data);
    
    // Broadcast to relevant users
    this.websocket.broadcast('inventory-update', data);
    
    // Track analytics
    await this.trackAnalytics('inventory-update', data);
  }

  public async trackAnalytics(event: string, data: any) {
    const analyticsData = {
      event,
      timestamp: new Date(),
      data
    };

    await this.cache.set(`analytics:${Date.now()}`, analyticsData);
  }
}
