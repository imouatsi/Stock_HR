import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { typedLogger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return res.status(400).json({
      status: 'fail',
      message
    });
  }

  // Handle Mongoose duplicate key errors
  if ((err as any).code === 11000) {
    const value = (err as any).errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return res.status(400).json({
      status: 'fail',
      message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again!'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired! Please log in again.'
    });
  }

  // Log unexpected errors
  typedLogger.error('Unexpected error:', err);

  // Send generic error response
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
}; 