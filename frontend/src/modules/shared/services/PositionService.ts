import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface Position {
  id: string;
  title: string;
  code: string;
  description: string;
  departmentId: string;
  level: number;
  minSalary: number;
  maxSalary: number;
  requirements: string[];
  responsibilities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface PositionStats {
  totalEmployees: number;
  activeEmployees: number;
  vacancies: number;
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
}

interface PositionHierarchy {
  id: string;
  title: string;
  level: number;
  children: PositionHierarchy[];
}

class PositionService {
  private static instance: PositionService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): PositionService {
    if (!PositionService.instance) {
      PositionService.instance = new PositionService();
    }
    return PositionService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.POSITION_CREATED, this.handlePositionCreated.bind(this));
    eventService.on(EventType.POSITION_UPDATED, this.handlePositionUpdated.bind(this));
    eventService.on(EventType.POSITION_DELETED, this.handlePositionDeleted.bind(this));
  }

  private async handlePositionCreated(data: { positionId: string; title: string }): Promise<void> {
    try {
      console.log(`Position created: ${data.title}`);
    } catch (error) {
      console.error('Error handling position creation:', error);
    }
  }

  private async handlePositionUpdated(data: { positionId: string; changes: Partial<{ title: string; code: string }> }): Promise<void> {
    try {
      console.log(`Position updated: ${data.positionId}`, data.changes);
    } catch (error) {
      console.error('Error handling position update:', error);
    }
  }

  private async handlePositionDeleted(data: { positionId: string }): Promise<void> {
    try {
      console.log(`Position deleted: ${data.positionId}`);
    } catch (error) {
      console.error('Error handling position deletion:', error);
    }
  }

  public async getPositions(): Promise<Position[]> {
    const response = await api.get('/positions');
    return response.data;
  }

  public async getPosition(id: string): Promise<Position> {
    const response = await api.get(`/positions/${id}`);
    return response.data;
  }

  public async createPosition(position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>): Promise<Position> {
    const response = await api.post('/positions', position);
    return response.data;
  }

  public async updatePosition(id: string, changes: Partial<Position>): Promise<Position> {
    const response = await api.patch(`/positions/${id}`, changes);
    return response.data;
  }

  public async deletePosition(id: string): Promise<void> {
    await api.delete(`/positions/${id}`);
  }

  public async getPositionStats(id: string): Promise<PositionStats> {
    const response = await api.get(`/positions/${id}/stats`);
    return response.data;
  }

  public async getPositionHierarchy(): Promise<PositionHierarchy> {
    const response = await api.get('/positions/hierarchy');
    return response.data;
  }

  public async getDepartmentPositions(departmentId: string): Promise<Position[]> {
    const response = await api.get(`/positions/department/${departmentId}`);
    return response.data;
  }

  public async getPositionEmployees(id: string): Promise<any[]> {
    const response = await api.get(`/positions/${id}/employees`);
    return response.data;
  }

  public async getPositionRequirements(id: string): Promise<string[]> {
    const response = await api.get(`/positions/${id}/requirements`);
    return response.data;
  }

  public async getPositionResponsibilities(id: string): Promise<string[]> {
    const response = await api.get(`/positions/${id}/responsibilities`);
    return response.data;
  }
}

export const positionService = PositionService.getInstance(); 