import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all categories routes
router.use(isAuthenticated);

// Get all categories
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      categories: [
        {
          _id: '1',
          name: 'Electronics',
          description: 'Electronic devices and components'
        },
        {
          _id: '2',
          name: 'Office Supplies',
          description: 'Office supplies and stationery'
        },
        {
          _id: '3',
          name: 'Furniture',
          description: 'Office furniture and fixtures'
        }
      ]
    }
  });
});

// Get a single category by ID
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      category: {
        _id: req.params.id,
        name: 'Electronics',
        description: 'Electronic devices and components'
      }
    }
  });
});

export default router;
