import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middleware/validation.middleware';
import { userSchema } from '../schemas/user.schema';
import { role } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', validate(userSchema), userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(role('user')); // All routes below require at least user role

router
  .route('/profile')
  .get(userController.getProfile)
  .put(validate(userSchema), userController.updateProfile);

// Admin routes
router.use(role('admin')); // All routes below require admin role

router
  .route('/')
  .get(userController.getAll)
  .post(validate(userSchema), userController.create);

router
  .route('/:id')
  .get(userController.getById)
  .put(validate(userSchema), userController.update)
  .delete(userController.delete);

// Authorization route
router.patch('/:id/authorize', userController.authorizeUser);

export default router;