import { Router } from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import * as userController from '../controllers/user.controller';
import { ROLES } from '../../frontend/src/config';

const router = Router();

const userValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).optional(),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('role').isIn(Object.keys(ROLES)),
  body('phoneNumber').optional().matches(/^\+?[\d\s-]{8,}$/),
  body('preferences.language').optional().isIn(['en', 'fr', 'ar']),
  body('preferences.theme').optional().isIn(['light', 'dark']),
];

router.get('/', protect, authorize('admin', 'superadmin'), userController.getUsers);
router.post('/', protect, authorize('admin', 'superadmin'), validate(userValidation), userController.createUser);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, validate(userValidation), userController.updateProfile);
router.post('/2fa/enable', protect, userController.enable2FA);
router.post('/2fa/verify', protect, userController.verify2FA);
router.put('/preferences', protect, userController.updatePreferences);
router.post('/avatar', protect, userController.uploadAvatar);

export default router;