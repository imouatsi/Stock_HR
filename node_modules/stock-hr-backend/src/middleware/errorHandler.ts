import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/error';
import logger from '../utils/logger';

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    message,
    status,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(status).json({
    status: 'error',
    message,
    code: err.code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};