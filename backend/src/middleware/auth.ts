import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { User } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JwtPayload {
  id: string;
  iat?: number;
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // 1) Check if token exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    } catch (error) {
      return next(new AppError('Invalid or expired token', 401));
    }

    // 3) Check if user still exists
    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (user.passwordChangedAt && decoded.iat) {
      const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedTimestamp) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
      }
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
}; 