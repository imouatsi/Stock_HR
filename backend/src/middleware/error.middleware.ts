import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Handle mongoose duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    return res.status(400).json({
      status: 'fail',
      message: 'Duplicate field value entered',
    });
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Default error
  console.error('Error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}; 