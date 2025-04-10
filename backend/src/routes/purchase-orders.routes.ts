import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all purchase orders routes
router.use(isAuthenticated);

// Get all purchase orders
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      purchaseOrders: []
    }
  });
});

// Get a single purchase order by ID
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      purchaseOrder: {
        _id: req.params.id,
        reference: 'PO-001',
        supplier: 'Supplier Inc.',
        items: [
          {
            inventoryItem: 'Item 1',
            quantity: 10,
            unitPrice: 100
          }
        ],
        status: 'pending',
        expectedDeliveryDate: '2023-05-15',
        notes: 'Urgent order'
      }
    }
  });
});

export default router;
