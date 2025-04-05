import { api } from '../features/api/apiSlice';

interface BaseCache {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl: number): Promise<void>;
}

interface Metrics {
  kpis: Record<string, any>;
  trends: Record<string, any>;
  predictions: Record<string, any>;
}

class LocalCache implements BaseCache {
  async get(key: string): Promise<any> {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const { value, expiry } = JSON.parse(item);
    if (expiry < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    const item = {
      value,
      expiry: Date.now() + ttl * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
}

// Mock data for the dashboard
const MOCK_DASHBOARD_DATA = {
  orders: [
    { id: 1, customer: 'Customer 1', amount: 1200 },
    { id: 2, customer: 'Customer 2', amount: 850 },
    { id: 3, customer: 'Customer 3', amount: 1500 }
  ],
  revenue: 3550,
  growth: 12.5,
  total_users: 15,
  inventory_items: 245,
  active_contracts: 8,
  total_invoices: 32,
  monthlyTrends: [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1400 },
    { month: 'Mar', value: 1100 },
    { month: 'Apr', value: 1600 }
  ],
  weeklyTrends: [
    { day: 'Mon', value: 120 },
    { day: 'Tue', value: 140 },
    { day: 'Wed', value: 110 },
    { day: 'Thu', value: 160 },
    { day: 'Fri', value: 190 }
  ],
  predictions: {
    nextMonth: { revenue: 4200, growth: 15.2 },
    forecast: [
      { month: 'May', value: 1800 },
      { month: 'Jun', value: 2100 },
      { month: 'Jul', value: 2300 }
    ]
  }
};

export class AnalyticsService {
  private static instance: AnalyticsService;
  private cache: BaseCache;
  private useMockData: boolean = true; // Flag to use mock data when API isn't available

  private constructor() {
    this.cache = new LocalCache();
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

    if (this.useMockData) {
      console.log('Using mock dashboard data');
      await this.cache.set('dashboard:metrics', MOCK_DASHBOARD_DATA, 300);
      return MOCK_DASHBOARD_DATA;
    }

    try {
      const response = await api.endpoints.getDashboardStats.initiate(undefined);
      if ('data' in response) {
        await this.cache.set('dashboard:metrics', response.data, 300);
        return response.data;
      }
      throw new Error('Failed to fetch dashboard metrics');
    } catch (error) {
      console.warn('Error fetching dashboard metrics, using mock data', error);
      await this.cache.set('dashboard:metrics', MOCK_DASHBOARD_DATA, 300);
      return MOCK_DASHBOARD_DATA;
    }
  }

  public async processMetrics(data: any): Promise<Metrics> {
    return {
      kpis: this.calculateKPIs(data),
      trends: this.analyzeTrends(data),
      predictions: await this.generatePredictions(data),
    };
  }

  private calculateKPIs(data: any) {
    return {
      total_users: data.total_users || 0,
      inventory_items: data.inventory_items || 0,
      active_contracts: data.active_contracts || 0,
      total_invoices: data.total_invoices || 0,
      totalOrders: data.orders?.length || 0,
      revenue: data.revenue || 0,
      growth: data.growth || 0
    };
  }

  private analyzeTrends(data: any) {
    return {
      monthly: data.monthlyTrends || [],
      weekly: data.weeklyTrends || [],
      // Add other trend calculations
    };
  }

  private async generatePredictions(data: any) {
    return {
      nextMonth: data.predictions?.nextMonth || {},
      forecast: data.predictions?.forecast || [],
      // Add other prediction calculations
    };
  }
}
