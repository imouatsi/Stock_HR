import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '../utils/appError';

export const validateRequest = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(400, 'Invalid request body: ' + errorMessage));
    }

    next();
  };
}; 