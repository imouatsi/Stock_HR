import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = {
  protect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1) Getting token and check if it's there
      let token;
      if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
      }

      // 2) Verification token
      const decoded = verifyToken(token);
      if (!decoded) {
        return next(new AppError('Invalid token. Please log in again!', 401));
      }

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
      }

      // 4) Check if user changed password after the token was issued
      if (currentUser.passwordChangedAt) {
        const changedTimestamp = currentUser.passwordChangedAt.getTime() / 1000;
        if (decoded.iat < changedTimestamp) {
          return next(new AppError('User recently changed password! Please log in again.', 401));
        }
      }

      // Grant access to protected route
      req.user = currentUser;
      next();
    } catch (error) {
      next(error);
    }
  },

  restrictTo: (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403));
      }

      next();
    };
  }
}; 