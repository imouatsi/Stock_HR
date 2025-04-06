import { Request, Response, NextFunction, CookieOptions } from 'express';
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
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
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
        isActive: user.isActive || true,
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
    return next(AppError.conflict('Email already in use'));
  }

  // Validate password
  const passwordValidation = validatePassword(req.body.password);
  if (!passwordValidation.isValid) {
    return next(AppError.validationError(passwordValidation.error!));
  }

  // Create new user
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'user',
    isActive: true
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(AppError.badRequest('Please provide email and password'));
  }

  // Find user and check if password is correct
  const user = await User.findOne({ email }).select('+password +isActive');
  
  if (!user || !user.isActive) {
    return next(AppError.unauthorized('Incorrect email or password'));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(AppError.unauthorized('Incorrect email or password'));
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
    return next(AppError.notFound('There is no user with that email address'));
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

    return next(AppError.internal('Error sending email. Please try again later.'));
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
    return next(AppError.badRequest('Token is invalid or has expired'));
  }

  // Validate new password
  const passwordValidation = validatePassword(req.body.password);
  if (!passwordValidation.isValid) {
    return next(AppError.validationError(passwordValidation.error!));
  }

  // Update password and clear reset token
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

export const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get user from collection
  const user = await User.findById(req.user!.id).select('+password');
  if (!user) {
    return next(AppError.notFound('User not found'));
  }

  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(req.body.currentPassword);
  if (!isCurrentPasswordValid) {
    return next(AppError.unauthorized('Current password is incorrect'));
  }

  // Validate new password
  const passwordValidation = validatePassword(req.body.newPassword);
  if (!passwordValidation.isValid) {
    return next(AppError.validationError(passwordValidation.error!));
  }

  // Update password
  user.password = req.body.newPassword;
  await user.save();

  createSendToken(user, 200, res);
});

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Create error if user tries to update password
  if (req.body.password) {
    return next(AppError.badRequest('This route is not for password updates. Please use /change-password'));
  }

  // Filter allowed fields
  const allowedFields = ['firstName', 'lastName', 'email', 'settings', 'organization'];
  const filteredBody = Object.keys(req.body)
    .filter(key => allowedFields.includes(key))
    .reduce((obj: any, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user!.id, filteredBody, {
    new: true,
    runValidators: true
  });

  if (!updatedUser) {
    return next(AppError.notFound('User not found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});