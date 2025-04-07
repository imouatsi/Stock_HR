import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

export enum ReportType {
  INVENTORY = 'inventory',
  SALES = 'sales',
  PURCHASES = 'purchases',
  EXPENSES = 'expenses',
  EMPLOYEES = 'employees',
  AUDIT = 'audit'
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

export interface Report {
  id: string;
  type: ReportType;
  format: ReportFormat;
  name: string;
  description?: string;
  parameters?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  error?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface ReportTemplate {
  id: string;
  type: ReportType;
  name: string;
  description?: string;
  parameters?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

class ReportService {
  private static instance: ReportService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.REPORT_GENERATED, this.handleReportGenerated);
    eventService.on(EventType.REPORT_FAILED, this.handleReportFailed);
  }

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  async getReports(): Promise<Report[]> {
    const response = await api.get('/reports');
    return response.data;
  }

  async getReport(id: string): Promise<Report> {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  }

  async generateReport(data: Omit<Report, 'id' | 'status' | 'fileUrl' | 'error' | 'createdBy' | 'createdAt' | 'completedAt'>): Promise<Report> {
    const response = await api.post('/reports', data);
    return response.data;
  }

  async deleteReport(id: string): Promise<void> {
    await api.delete(`/reports/${id}`);
  }

  async getTemplates(): Promise<ReportTemplate[]> {
    const response = await api.get('/reports/templates');
    return response.data;
  }

  async getTemplate(id: string): Promise<ReportTemplate> {
    const response = await api.get(`/reports/templates/${id}`);
    return response.data;
  }

  async createTemplate(data: Omit<ReportTemplate, 'id' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>): Promise<ReportTemplate> {
    const response = await api.post('/reports/templates', data);
    return response.data;
  }

  async updateTemplate(id: string, data: Partial<ReportTemplate>): Promise<ReportTemplate> {
    const response = await api.put(`/reports/templates/${id}`, data);
    return response.data;
  }

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/reports/templates/${id}`);
  }

  async downloadReport(id: string): Promise<Blob> {
    const response = await api.get(`/reports/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  private async handleReportGenerated(data: { report: Report }): Promise<void> {
    try {
      // Handle report generated event
      console.log('Report generated:', data.report);
    } catch (error) {
      console.error('Failed to handle report generated:', error);
    }
  }

  private async handleReportFailed(data: { reportId: string; error: string }): Promise<void> {
    try {
      // Handle report failed event
      console.log('Report failed:', data);
    } catch (error) {
      console.error('Failed to handle report failed:', error);
    }
  }
}

export const reportService = ReportService.getInstance(); 