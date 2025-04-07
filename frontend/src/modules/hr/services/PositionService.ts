import { Position, PositionFormData, PositionFilters } from '../types/position.types';

class PositionService {
  private static instance: PositionService;
  private baseUrl = '/api/positions';

  private constructor() {}

  public static getInstance(): PositionService {
    if (!PositionService.instance) {
      PositionService.instance = new PositionService();
    }
    return PositionService.instance;
  }

  async getPositions(filters?: PositionFilters): Promise<Position[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch positions');
    return response.json();
  }

  async getPosition(id: string): Promise<Position> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch position');
    return response.json();
  }

  async createPosition(data: PositionFormData): Promise<Position> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create position');
    return response.json();
  }

  async updatePosition(id: string, data: Partial<PositionFormData>): Promise<Position> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update position');
    return response.json();
  }

  async deletePosition(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete position');
  }
}

export const positionService = PositionService.getInstance(); 