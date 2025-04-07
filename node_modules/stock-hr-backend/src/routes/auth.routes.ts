import express from 'express';
import { signup, login, logout, protect, restrictTo } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'User not found'
    });
  }

  const { _id, username, role, isAuthorized, isActive } = req.user;
  
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: _id,
        username,
        role,
        isAuthorized,
        isActive
      }
    }
  });
});

// Admin only routes
router.get('/admin', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the admin area'
  });
});

export default router; 