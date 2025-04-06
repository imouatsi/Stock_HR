import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

export enum ImportExportType {
  EMPLOYEE = 'employee',
  DEPARTMENT = 'department',
  POSITION = 'position',
  ASSET = 'asset',
  STOCK = 'stock',
  INVOICE = 'invoice',
  EXPENSE = 'expense',
  USER = 'user',
  SETTING = 'setting'
}

export enum ImportExportFormat {
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

export interface ImportExportJob {
  id: string;
  type: ImportExportType;
  format: ImportExportFormat;
  operation: 'import' | 'export';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  error?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface ImportExportTemplate {
  id: string;
  type: ImportExportType;
  format: ImportExportFormat;
  name: string;
  description?: string;
  fields: string[];
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

class ImportExportService {
  private static instance: ImportExportService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.IMPORT_EXPORT_STARTED, this.handleImportExportStarted);
    eventService.on(EventType.IMPORT_EXPORT_COMPLETED, this.handleImportExportCompleted);
    eventService.on(EventType.IMPORT_EXPORT_FAILED, this.handleImportExportFailed);
  }

  public static getInstance(): ImportExportService {
    if (!ImportExportService.instance) {
      ImportExportService.instance = new ImportExportService();
    }
    return ImportExportService.instance;
  }

  async getJobs(): Promise<ImportExportJob[]> {
    const response = await api.get('/import-export/jobs');
    return response.data;
  }

  async getJob(id: string): Promise<ImportExportJob> {
    const response = await api.get(`/import-export/jobs/${id}`);
    return response.data;
  }

  async importData(data: Omit<ImportExportJob, 'id' | 'status' | 'fileUrl' | 'error' | 'createdBy' | 'createdAt' | 'completedAt'>): Promise<ImportExportJob> {
    const response = await api.post('/import-export/import', data);
    return response.data;
  }

  async exportData(data: Omit<ImportExportJob, 'id' | 'status' | 'fileUrl' | 'error' | 'createdBy' | 'createdAt' | 'completedAt'>): Promise<ImportExportJob> {
    const response = await api.post('/import-export/export', data);
    return response.data;
  }

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/import-export/jobs/${id}`);
  }

  async getTemplates(): Promise<ImportExportTemplate[]> {
    const response = await api.get('/import-export/templates');
    return response.data;
  }

  async getTemplate(id: string): Promise<ImportExportTemplate> {
    const response = await api.get(`/import-export/templates/${id}`);
    return response.data;
  }

  async createTemplate(data: Omit<ImportExportTemplate, 'id' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>): Promise<ImportExportTemplate> {
    const response = await api.post('/import-export/templates', data);
    return response.data;
  }

  async updateTemplate(id: string, data: Partial<ImportExportTemplate>): Promise<ImportExportTemplate> {
    const response = await api.put(`/import-export/templates/${id}`, data);
    return response.data;
  }

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/import-export/templates/${id}`);
  }

  async downloadExport(id: string): Promise<Blob> {
    const response = await api.get(`/import-export/jobs/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  private async handleImportExportStarted(data: { job: ImportExportJob }): Promise<void> {
    try {
      // Handle import/export started event
      console.log('Import/Export started:', data.job);
    } catch (error) {
      console.error('Failed to handle import/export started:', error);
    }
  }

  private async handleImportExportCompleted(data: { job: ImportExportJob }): Promise<void> {
    try {
      // Handle import/export completed event
      console.log('Import/Export completed:', data.job);
    } catch (error) {
      console.error('Failed to handle import/export completed:', error);
    }
  }

  private async handleImportExportFailed(data: { jobId: string; error: string }): Promise<void> {
    try {
      // Handle import/export failed event
      console.log('Import/Export failed:', data);
    } catch (error) {
      console.error('Failed to handle import/export failed:', error);
    }
  }
}

export const importExportService = ImportExportService.getInstance(); 