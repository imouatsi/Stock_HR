import { Request, Response, NextFunction } from 'express';
import { Schema } from 'yup';
import { AppError } from '../utils/appError';

export const validate = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = error.errors.map((err: string) => err);
        next(AppError.badRequest(errors.join('. ')));
      } else {
        next(error);
      }
    }
  };
}; 