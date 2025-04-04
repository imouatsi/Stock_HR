import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as controllers from '../controllers';

const router = Router();

// Auth routes
router.post('/auth/login', controllers.auth.login);
router.post('/auth/register', controllers.auth.register);
router.post('/auth/refresh-token', controllers.auth.refreshToken);
router.post('/auth/logout', auth, controllers.auth.logout);

// User routes
router.get('/users', auth, controllers.users.getAll);
router.get('/users/:id', auth, controllers.users.getById);
router.put('/users/:id', auth, controllers.users.update);
router.delete('/users/:id', auth, controllers.users.delete);

// Inventory routes
router.get('/inventory', auth, controllers.inventory.getAll);
router.post('/inventory', auth, controllers.inventory.create);
router.put('/inventory/:id', auth, controllers.inventory.update);
router.delete('/inventory/:id', auth, controllers.inventory.delete);

// Analytics routes
router.get('/analytics/dashboard', auth, controllers.analytics.getDashboard);
router.get('/analytics/reports', auth, controllers.analytics.getReports);
router.post('/analytics/generate-report', auth, controllers.analytics.generateReport);

export default router;
