import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw AppError.unauthorized('You are not logged in. Please log in to get access.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      throw AppError.unauthorized('The user belonging to this token no longer exists.');
    }

    if (!user.isAuthorized) {
      throw AppError.unauthorized('Your account is not yet authorized. Please wait for admin approval.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const role = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw AppError.unauthorized('You are not logged in. Please log in to get access.');
    }

    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden('You do not have permission to perform this action.');
    }

    next();
  };
}; 