export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'BAD_REQUEST'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SERVICE_UNAVAILABLE';

export interface ErrorDetails {
  field?: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly details?: ErrorDetails[];
  public readonly code: ErrorCode;
  public readonly timestamp: string;

  constructor(
    message: string,
    statusCode: number,
    details?: ErrorDetails[],
    code?: ErrorCode
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;
    this.code = code || this.getErrorCodeFromStatus(statusCode);
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  private getErrorCodeFromStatus(statusCode: number): ErrorCode {
    switch (statusCode) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'AUTHENTICATION_ERROR';
      case 403:
        return 'AUTHORIZATION_ERROR';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 429:
        return 'RATE_LIMIT_EXCEEDED';
      case 503:
        return 'SERVICE_UNAVAILABLE';
      default:
        return 'INTERNAL_ERROR';
    }
  }

  public toJSON() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };
  }

  // Helper methods for creating common errors
  static badRequest(message: string, details?: ErrorDetails[]) {
    return new AppError(message, 400, details, 'BAD_REQUEST');
  }

  static unauthorized(message: string = 'Authentication required', details?: ErrorDetails[]) {
    return new AppError(message, 401, details, 'AUTHENTICATION_ERROR');
  }

  static forbidden(message: string = 'Access denied', details?: ErrorDetails[]) {
    return new AppError(message, 403, details, 'AUTHORIZATION_ERROR');
  }

  static notFound(message: string = 'Resource not found', details?: ErrorDetails[]) {
    return new AppError(message, 404, details, 'NOT_FOUND');
  }

  static conflict(message: string, details?: ErrorDetails[]) {
    return new AppError(message, 409, details, 'CONFLICT');
  }

  static validationError(message: string, details?: ErrorDetails[]) {
    return new AppError(message, 400, details, 'VALIDATION_ERROR');
  }

  static rateLimitExceeded(message: string = 'Too many requests', details?: ErrorDetails[]) {
    return new AppError(message, 429, details, 'RATE_LIMIT_EXCEEDED');
  }

  static internal(message: string = 'Internal server error', details?: ErrorDetails[]) {
    return new AppError(message, 500, details, 'INTERNAL_ERROR');
  }

  static serviceUnavailable(message: string = 'Service temporarily unavailable', details?: ErrorDetails[]) {
    return new AppError(message, 503, details, 'SERVICE_UNAVAILABLE');
  }
}