import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.body) {
    return next(new AppError('Invalid request body', 400));
  }
  next();
};