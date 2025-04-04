import { Router } from 'express';
import { protect } from '../middleware/auth';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import inventoryRoutes from './inventory.routes';
import contractRoutes from './contract.routes';
import invoiceRoutes from './invoice.routes';
import licenseRoutes from './license.routes';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', protect, userRoutes);
router.use('/inventory', protect, inventoryRoutes);
router.use('/contracts', protect, contractRoutes);
router.use('/invoices', protect, invoiceRoutes);
router.use('/licenses', protect, licenseRoutes);

export default router; 