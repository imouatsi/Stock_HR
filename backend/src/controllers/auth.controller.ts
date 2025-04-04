import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.model';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';
import { generateTOTP, verifyTOTP } from '../utils/totp';
import UAParser from 'ua-parser-js';
import { AppError } from '../utils/appError';

const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const generateSessionToken = (userId: string, deviceInfo: any): string => {
  return jwt.sign(
    { id: userId, device: deviceInfo },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'stock_clerk',
    });

    createSendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, totpToken } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      await user?.incLoginAttempts();
      throw new Error('Invalid credentials');
    }

    if (user.preferences.twoFactorEnabled && !totpToken) {
      return res.status(200).json({
        status: 'pending',
        message: '2FA required',
        requires2FA: true
      });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new Error('Account temporarily locked');
    }

    const parser = new UAParser(req.headers['user-agent']);
    const deviceInfo = {
      browser: parser.getBrowser().name,
      os: parser.getOS().name,
      device: parser.getDevice().type || 'desktop'
    };

    const token = generateSessionToken(user._id, deviceInfo);
    const session = {
      token,
      device: JSON.stringify(deviceInfo),
      ip: req.ip,
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    user.sessions.push(session);
    user.lastLogin = new Date();
    await user.resetLoginAttempts();
    await user.save();

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Get user based on email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('There is no user with that email address', 404));
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // TODO: Send reset token via email
    // For now, just return the token
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email',
      data: {
        resetToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;

    // Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};