import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/user.model';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export const verifyToken = async (token: string): Promise<IUser> => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    const user = await User.findById(decoded.id).select('-password +active');
    if (!user) {
      throw AppError.unauthorized('User not found');
    }
    if (!user.isActive) {
      throw AppError.unauthorized('User is inactive');
    }
    return user;
  } catch (error) {
    throw AppError.unauthorized('Invalid token');
  }
};

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Get token from header or cookie
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(AppError.unauthorized('You are not logged in! Please log in to get access.'));
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };

    // Check if user exists
    const currentUser = await User.findById(decoded.id).select('+active');
    if (!currentUser) {
      return next(AppError.unauthorized('The user belonging to this token no longer exists.'));
    }

    // Check if user is active
    if (!currentUser.isActive) {
      return next(AppError.unauthorized('Your account is inactive. Please contact support.'));
    }

    // Log successful authentication
    logger.info('User authenticated successfully', {
      userId: currentUser._id,
      email: currentUser.email
    });

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    return next(AppError.unauthorized('Invalid token. Please log in again.'));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(AppError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
};

// Export protect as authMiddleware for backward compatibility
export const authMiddleware = protect;