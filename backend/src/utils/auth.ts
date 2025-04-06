import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../interfaces/user.interface';

interface JwtPayload {
  id: string;
  iat: number;
}

const signToken = (id: string): string => {
  const payload: JwtPayload = { 
    id,
    iat: Math.floor(Date.now() / 1000)
  };
  const options: SignOptions = {
    expiresIn: '24h' // Hardcoded value since config.jwtExpiresIn is causing type issues
  };

  return jwt.sign(payload, config.jwtSecret, options);
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
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}; 