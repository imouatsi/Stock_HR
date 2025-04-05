import express from 'express';
import * as userController from '../controllers/user.controller';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

const userValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').isIn(['USER', 'ADMIN', 'SUPERADMIN']).withMessage('Invalid role')
];

// Public routes
router.post('/register', validate(userValidation), userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validate(userValidation), userController.updateProfile);
router.patch('/preferences', userController.updatePreferences);
router.post('/avatar', userController.uploadAvatar);

// 2FA routes
router.post('/2fa/enable', userController.enable2FA);
router.post('/2fa/verify', userController.verify2FA);

// Admin routes
router.use(restrictTo('ADMIN', 'SUPERADMIN'));

router.route('/')
  .get(userController.getUsers)
  .post(validate(userValidation), userController.createUser);

export default router;