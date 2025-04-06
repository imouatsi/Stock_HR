import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map((detail: any) => detail.message).join(', ');
      return next(new AppError(message, 400));
    }

    next();
  };
}; 