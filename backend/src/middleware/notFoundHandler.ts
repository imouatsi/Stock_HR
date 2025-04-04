import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.warn(`Route not found: ${req.method} ${req.originalUrl}`); // Log missing route
  next(new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
};