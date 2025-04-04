import { Router } from 'express';
import {
  login,
  register,
  getProfile,
  updateProfile
} from '../controllers/user.controller';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router; 