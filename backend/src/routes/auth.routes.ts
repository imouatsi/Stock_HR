import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
} from '../controllers/auth.controller';
import {
  loginValidator,
  registerValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
} from '../validators/auth.validator';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validateRequest, resetPassword);

// Protected routes
router.use(protect); // All routes below this line require authentication
router.post('/logout', logout);
router.patch('/change-password', changePasswordValidator, validateRequest, changePassword);
router.patch('/profile', updateProfileValidator, validateRequest, updateProfile);

export default router; 