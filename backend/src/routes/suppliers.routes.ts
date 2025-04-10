import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all suppliers routes
router.use(isAuthenticated);

// Get all suppliers
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      suppliers: []
    }
  });
});

// Get a single supplier by ID
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      supplier: {
        _id: req.params.id,
        name: 'Supplier Inc.',
        contactPerson: 'Jane Doe',
        email: 'jane.doe@supplier.com',
        phone: '123-456-7890',
        address: '123 Supplier St, City, Country'
      }
    }
  });
});

export default router;
