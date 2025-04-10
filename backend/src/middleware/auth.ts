import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/user.interface';
import { verifyToken } from '../utils/auth';
import User from '../models/user.model';
import { AppError } from '../utils/appError';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
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
      return next(new AppError('Invalid token! Please log in again.', 401));
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Authentication failed', 401));
  }
};
