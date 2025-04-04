import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { config } from '../config';
import { AppError } from '../utils/errorHandler';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 'AUTH_001', 401);
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 'AUTH_002', 401);
    }

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    user.lastLogin = new Date();
    await user.save();

    return { user, token, refreshToken };
  }

  private static generateToken(user: any) {
    return jwt.sign(
      { id: user._id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  private static generateRefreshToken(user: any) {
    return jwt.sign(
      { id: user._id, version: user.tokenVersion },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }
}
