import { api } from '../features/api/apiSlice';
import { CacheService } from './CacheService';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private cache: CacheService;

  private constructor() {
    this.cache = new CacheService();
  }

  public static getInstance(): AnalyticsService {
    if (!this.instance) {
      this.instance = new AnalyticsService();
    }
    return this.instance;
  }

  public async getDashboardMetrics() {
    const cached = await this.cache.get('dashboard:metrics');
    if (cached) return cached;

    const response = await api.get('/analytics/dashboard');
    await this.cache.set('dashboard:metrics', response.data, 300);
    return response.data;
  }

  public async processMetrics(data: any) {
    const processed = {
      kpis: this.calculateKPIs(data),
      trends: this.analyzeTrends(data),
      predictions: await this.generatePredictions(data)
    };
    
    return processed;
  }
}
