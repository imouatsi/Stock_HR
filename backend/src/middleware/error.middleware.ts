import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { ValidationError } from 'express-validator';
import { AppError, ErrorDetails } from '../utils/appError';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error | AppError | MongoError | MongooseError.ValidationError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(err instanceof AppError && {
      statusCode: err.statusCode,
      code: err.code,
      details: err.details,
    }),
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle Mongoose validation errors
  if (err instanceof MongooseError.ValidationError) {
    const details: ErrorDetails[] = Object.values(err.errors).map(error => ({
      field: error.path,
      value: error.value,
      reason: error.message,
    }));
    const appError = AppError.validationError('Validation failed', details);
    return res.status(appError.statusCode).json(appError.toJSON());
  }

  // Handle MongoDB duplicate key errors
  if (err instanceof MongoError && err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    const details: ErrorDetails[] = [{
      field,
      value: (err as any).keyValue?.[field],
      reason: 'Duplicate value not allowed',
    }];
    const appError = AppError.conflict('Duplicate field value entered', details);
    return res.status(appError.statusCode).json(appError.toJSON());
  }

  // Handle express-validator errors
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const details: ErrorDetails[] = err.map(error => ({
      field: error.param,
      value: error.value,
      reason: error.msg,
    }));
    const appError = AppError.validationError('Validation failed', details);
    return res.status(appError.statusCode).json(appError.toJSON());
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    const appError = AppError.badRequest(err.message);
    return res.status(appError.statusCode).json(appError.toJSON());
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const appError = AppError.unauthorized('Invalid token');
    return res.status(appError.statusCode).json(appError.toJSON());
  }

  if (err.name === 'TokenExpiredError') {
    const appError = AppError.unauthorized('Token expired');
    return res.status(appError.statusCode).json(appError.toJSON());
  }

  // Default error (500 Internal Server Error)
  const appError = AppError.internal(
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  );
  return res.status(appError.statusCode).json(appError.toJSON());
}; 