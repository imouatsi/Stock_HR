import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

const isProduction = process.env.NODE_ENV === 'production';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: isProduction ? 'An error occurred' : err.message, // Hide detailed messages in production
      code: err.code
    });
  }

  // Handle MongoDB duplicate key errors
  if ((err as any).code === 11000) {
    return res.status(400).json({
      status: 'fail',
      message: 'Duplicate field value entered',
      code: 'DUPLICATE_KEY'
    });
  }

  // Handle validation errors
  if ((err as any).name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((el: any) => el.message);
    return res.status(400).json({
      status: 'fail',
      message: errors.join(', '),
      code: 'VALIDATION_ERROR'
    });
  }

  // Handle JWT errors
  if ((err as any).name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again!',
      code: 'INVALID_TOKEN'
    });
  }

  if ((err as any).name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired! Please log in again.',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Default error
  console.error('Unexpected error:', err); // Log unexpected errors
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    code: 'INTERNAL_SERVER_ERROR'
  });
};