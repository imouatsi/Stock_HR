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
  value?: any;
  reason?: string;
  [key: string]: any;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly code: ErrorCode;
  public readonly details?: ErrorDetails[];
  public readonly timestamp: Date;

  constructor(
    statusCode: number,
    message: string,
    code: ErrorCode = 'INTERNAL_ERROR',
    details?: ErrorDetails[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();

    Error.captureStackTrace(this, this.constructor);
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
    return new AppError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message: string = 'Authentication required', details?: ErrorDetails[]) {
    return new AppError(401, message, 'AUTHENTICATION_ERROR', details);
  }

  static forbidden(message: string = 'Access denied', details?: ErrorDetails[]) {
    return new AppError(403, message, 'AUTHORIZATION_ERROR', details);
  }

  static notFound(message: string = 'Resource not found', details?: ErrorDetails[]) {
    return new AppError(404, message, 'NOT_FOUND', details);
  }

  static conflict(message: string, details?: ErrorDetails[]) {
    return new AppError(409, message, 'CONFLICT', details);
  }

  static validationError(message: string, details?: ErrorDetails[]) {
    return new AppError(400, message, 'VALIDATION_ERROR', details);
  }

  static rateLimitExceeded(message: string = 'Too many requests', details?: ErrorDetails[]) {
    return new AppError(429, message, 'RATE_LIMIT_EXCEEDED', details);
  }

  static internal(message: string = 'Internal server error', details?: ErrorDetails[]) {
    return new AppError(500, message, 'INTERNAL_ERROR', details);
  }

  static serviceUnavailable(message: string = 'Service temporarily unavailable', details?: ErrorDetails[]) {
    return new AppError(503, message, 'SERVICE_UNAVAILABLE', details);
  }
}