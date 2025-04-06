import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/appError';

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || 'Too many requests, please try again later.',
    handler: (req: Request, res: Response) => {
      throw AppError.rateLimitExceeded();
    },
  });
};

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
}); 