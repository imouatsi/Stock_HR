import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';

export const userController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find();
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(new AppError('No user found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, role } = req.body;

      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return next(new AppError('Username already exists', 400));
      }

      const newUser = await User.create({
        username,
        password,
        role
      });

      res.status(201).json({
        status: 'success',
        data: {
          user: newUser
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, role, isActive, isAuthorized } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          username,
          role,
          isActive,
          isAuthorized
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!user) {
        return next(new AppError('No user found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return next(new AppError('No user found with that ID', 404));
      }
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}; 