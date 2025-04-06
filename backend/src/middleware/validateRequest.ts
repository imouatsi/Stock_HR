import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/appError';

export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map(err => err.msg).join(', ');
    return next(new AppError('Invalid request body: ' + errorMessage, 400));
  }
  next();
};