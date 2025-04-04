import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/user.model';
import { AppError } from '../utils/appError';

export const login = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement login logic
    res.status(200).json({
      status: 'success',
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement registration logic
    res.status(201).json({
      status: 'success',
      message: 'Registration successful'
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement update profile logic
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const user = await User.create({ email, password, firstName, lastName, role });
    res.status(201).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const enable2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError('User not authenticated', 401));
    }

    user.mfa.enabled = true;
    await user.save();
    res.status(200).json({ status: 'success', message: '2FA enabled' });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user || !user.mfa.secret) {
      return next(new AppError('2FA not enabled for this user', 400));
    }

    // Add logic to verify the 2FA code
    res.status(200).json({ status: 'success', message: '2FA verified' });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError('User not authenticated', 401));
    }

    user.preferences = { ...user.preferences, ...req.body.preferences };
    await user.save();
    res.status(200).json({ status: 'success', message: 'Preferences updated' });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError('User not authenticated', 401));
    }

    // Add logic to handle avatar upload
    res.status(200).json({ status: 'success', message: 'Avatar uploaded' });
  } catch (error) {
    next(error);
  }
};