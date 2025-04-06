import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';
import bcrypt from 'bcryptjs';

const userController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw AppError.badRequest('Please provide username and password');
      }

      const user = await User.findOne({ username }).select('+password +isAuthorized');
      
      if (!user || !user.isAuthorized) {
        throw AppError.unauthorized('Invalid username or password');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw AppError.unauthorized('Invalid username or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isAuthorized: user.isAuthorized,
            lastLogin: user.lastLogin
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, firstName, lastName, role } = req.body;

      // Check if username exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw AppError.conflict('Username already in use');
      }

      // Create new user (not authorized by default)
      const newUser = await User.create({
        username,
        password,
        firstName,
        lastName,
        role: role || 'user',
        isAuthorized: false
      });

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully. Waiting for admin authorization.',
        data: {
          user: {
            id: newUser._id,
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            isAuthorized: newUser.isAuthorized
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user?.id).select('-password');
      if (!user) {
        throw AppError.notFound('User not found');
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { password, ...userData } = req.body;
      const updateData = { ...userData };

      if (password) {
        updateData.password = await bcrypt.hash(password, 12);
      }

      const user = await User.findByIdAndUpdate(
        req.user?.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw AppError.notFound('User not found');
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        throw AppError.notFound('User not found');
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, ...userData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        isAuthorized: true // Admin-created users are authorized by default
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, ...userData } = req.body;
      const updateData = { ...userData };

      if (password) {
        updateData.password = await bcrypt.hash(password, 12);
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw AppError.notFound('User not found');
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        throw AppError.notFound('User not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async authorizeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isAuthorized: true },
        { new: true }
      ).select('-password');

      if (!user) {
        throw AppError.notFound('User not found');
      }

      res.json({
        status: 'success',
        message: 'User authorized successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
};

export { userController };