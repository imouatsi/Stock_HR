import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import UserModel, { IUser } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JWTPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const verifyToken = async (token: string): Promise<IUser> => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new Error('Unauthorized'));
    }

    if (!roles.includes(req.user.role as string)) {
      return next(new Error('Insufficient permissions'));
    }

    next();
  };
};