import { Router } from 'express';
import { warehouseController } from '../controllers/warehouse.controller';
import { isAuthenticated } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Apply authentication middleware to all warehouse routes
router.use(isAuthenticated);

// Get all warehouses
router.get(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  warehouseController.getAllWarehouses
);

// Create a new warehouse
router.post(
  '/',
  authorize(['admin', 'superadmin']),
  warehouseController.createWarehouse
);

// Get a single warehouse by ID
router.get(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  warehouseController.getWarehouseById
);

// Update a warehouse
router.patch(
  '/:id',
  authorize(['admin', 'superadmin']),
  warehouseController.updateWarehouse
);

// Delete a warehouse
router.delete(
  '/:id',
  authorize(['admin', 'superadmin']),
  warehouseController.deleteWarehouse
);

// Get warehouses by manager
router.get(
  '/manager/:managerId',
  authorize(['admin', 'superadmin', 'stock_manager']),
  warehouseController.getWarehousesByManager
);

export default router;
