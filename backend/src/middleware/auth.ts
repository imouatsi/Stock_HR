import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/user.interface';

// This is a temporary middleware to bypass authentication
// In a real application, this would verify the user's token and set req.user
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Set a dummy user for testing
  // Using 'as any as IUser' to bypass TypeScript's strict type checking
  // In a real application, we would create a proper IUser object
  req.user = {
    _id: '123456789012345678901234',
    username: 'testuser',
    role: 'admin',
    isAuthorized: true,
    isActive: true,
    comparePassword: async () => true
  } as any as IUser;
  next();
};
