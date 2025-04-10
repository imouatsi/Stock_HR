import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all movements routes
router.use(isAuthenticated);

// Get all movements
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      movements: []
    }
  });
});

// Get a single movement by ID
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      movement: {
        _id: req.params.id,
        type: 'in',
        quantity: 10,
        inventoryItem: 'Item 1',
        reference: 'REF-001',
        notes: 'Restocking',
        status: 'completed',
        user: 'John Doe',
        timestamp: new Date().toISOString()
      }
    }
  });
});

export default router;
