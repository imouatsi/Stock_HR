export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
} 