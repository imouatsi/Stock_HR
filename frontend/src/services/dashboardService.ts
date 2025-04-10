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
      console.log('Fetching dashboard data...');

      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, cannot fetch dashboard data');
        throw new Error('Authentication required');
      }

      const response = await apiService.get<{ status: string; data: DashboardData }>('/dashboard/stats');
      console.log('Dashboard API response:', response);

      if (response && response.status === 'success' && response.data) {
        return response.data;
      }

      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from API');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);

      // Return default empty data instead of throwing
      return {
        totalRevenue: 0,
        activeContracts: 0,
        totalUsers: 0,
        inventoryItems: 0
      };
    }
  }
}

export const dashboardService = DashboardService.getInstance();
export default dashboardService;
