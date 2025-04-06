import express from 'express';
import { userController } from '../controllers/user.controller';
import { userValidation } from '../validation/user.validation';
import { validateRequest } from '../middleware/validate.middleware';
import { protect, restrictTo } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(validateRequest(userValidation.createUser), userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(validateRequest(userValidation.updateUser), userController.updateUser)
  .delete(userController.deleteUser);

export default router; 