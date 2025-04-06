import { Router } from 'express';
import { protect } from '../middleware/auth';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import inventoryRoutes from './inventory.routes';
import contractRoutes from './contract.routes';
import invoiceRoutes from './invoice.routes';
import licenseRoutes from './license.routes';
import stockRoutes from '../modules/stock/routes/stock.routes';
import companyRoutes from './company.routes';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/company', auth, companyRoutes);
router.use('/user', auth, userRoutes);
router.use('/inventory', protect, inventoryRoutes);
router.use('/contracts', protect, contractRoutes);
router.use('/invoices', protect, invoiceRoutes);
router.use('/licenses', protect, licenseRoutes);
router.use('/stock', stockRoutes);

export default router; 