import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';
import { sendEmail } from '../utils/email';
import { catchAsync } from '../utils/catchAsync';
import { validatePassword } from '../utils/passwordValidator';

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 86400, // 24 hours in seconds
  };
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', options);
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '24') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError(400, 'Email already in use'));
  }

  const passwordValidation = validatePassword(req.body.password);
  if (!passwordValidation.isValid) {
    return next(new AppError(400, passwordValidation.error!));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'user',
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError(401, 'Incorrect email or password'));
  }

  createSendToken(user, 200, res);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(404, 'There is no user with that email address'));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetToken = passwordResetToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail(
      user.email,
      'Your password reset token (valid for 10 min)',
      message
    );

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(500, 'There was an error sending the email. Try again later!'));
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError(400, 'Token is invalid or has expired'));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});