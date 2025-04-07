import { Response } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { promisify } from 'util';
import { config } from '../config';
import { IUser } from '../interfaces/user.interface';

interface JwtPayload {
  id: string;
  iat?: number;
}

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '90d';

export const signToken = (id: string): string => {
  const payload: JwtPayload = { id };
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  const token = signToken(user._id);

  // Remove password from output
  const userWithoutPassword = { ...user.toObject() };
  delete userWithoutPassword.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userWithoutPassword
    }
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
}; 