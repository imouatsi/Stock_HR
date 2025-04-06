import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';
import { sendEmail } from '../utils/email';
import { catchAsync } from '../utils/catchAsync';
import { validatePassword } from '../utils/passwordValidator';
import { config } from '../config';

const JWT_EXPIRES_IN = '24h';
const COOKIE_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN
  };
  return jwt.sign({ id }, config.jwt.secret, options);
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  
  // Set cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' as const
  };

  // Set JWT cookie
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions || [],
        isActive: user.active || true,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError(400, 'Email already in use'));
  }

  // Validate password
  const passwordValidation = validatePassword(req.body.password);
  if (!passwordValidation.isValid) {
    return next(new AppError(400, passwordValidation.error!));
  }

  // Create new user
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'user',
    active: true
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password'));
  }

  // Find user and check if password is correct
  const user = await User.findOne({ email }).select('+password +active');
  
  if (!user || !user.active) {
    return next(new AppError(401, 'Incorrect email or password'));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError(401, 'Incorrect email or password'));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Send token
  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully logged out'
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Find user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(404, 'There is no user with that email address'));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetToken = passwordResetToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    await sendEmail(
      user.email,
      'Password Reset Request',
      `To reset your password, click the following link: ${resetURL}\nIf you didn't request this, please ignore this email.`
    );

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(500, 'Error sending email. Please try again later.'));
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError(400, 'Token is invalid or has expired'));
  }

  // Validate new password
  const passwordValidation = validatePassword(req.body.password);
  if (!passwordValidation.isValid) {
    return next(new AppError(400, passwordValidation.error!));
  }

  // Update password and clear reset token
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});