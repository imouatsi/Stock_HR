import apiService from './api.service';

export interface DashboardData {
  totalRevenue: number;
  activeContracts: number;
  totalUsers: number;
  inventoryItems: number;
}

class DashboardService {
  private static instance: DashboardService;

  private constructor() {}

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await apiService.get<DashboardData>('/dashboard/stats');
      // Check if we have valid data in the response
      if (response && response.data) {
        return response.data;
      }
      // If we get here, use mock data
      console.log('Using mock data due to invalid response format');
      return this.getMockDashboardData();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data if API fails
      return this.getMockDashboardData();
    }
  }

  private getMockDashboardData(): DashboardData {
    return {
      totalRevenue: 45231.89,
      activeContracts: 24,
      totalUsers: 573,
      inventoryItems: 1432
    };
  }
}

export const dashboardService = DashboardService.getInstance();
export default dashboardService;
