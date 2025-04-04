import { Request, NextFunction, RequestHandler } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from '../types/error';

export const validate = (validations: ValidationChain[]): RequestHandler => {
  return async (req: Request, _res: any, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const error = new ApiError(
      'Validation error',
      400,
      'VALIDATION_ERROR'
    );
    error.details = errors.array();
    next(error);
  };
};
