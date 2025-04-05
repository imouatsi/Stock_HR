import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/user.model';
import { AppError } from '../utils/appError';

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
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
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
    return next(new AppError(401, 'You are not logged in! Please log in to get access.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError(401, 'The user belonging to this token no longer exists.'));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError(401, 'Invalid token. Please log in again.'));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
};

// Export protect as authMiddleware for backward compatibility
export const authMiddleware = protect;