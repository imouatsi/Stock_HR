import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all dashboard routes
router.use(isAuthenticated);

// Get dashboard statistics
router.get('/stats', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      totalRevenue: 0,
      activeContracts: 0,
      totalUsers: 0,
      inventoryItems: 0
    }
  });
});

export default router;
