import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AppError } from '../utils/appError';
import { verifyToken, signToken } from '../utils/auth';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, role } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new AppError('Username already exists', 400));
    }

    // Create new user
    const user = await User.create({
      username,
      password,
      role: role || 'user'
    });

    // Generate token
    const token = signToken(user._id);

    // Remove password from output
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    // 1) Check if username and password exist
    if (!username || !password) {
      return next(new AppError('Please provide username and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect username or password', 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);

    // Remove password from output
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new AppError('Invalid token! Please log in again.', 401));
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
      if (decoded.iat && decoded.iat < changedTimestamp) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
      }
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
}; 