import { Router } from 'express';
import { supplierController } from '../controllers/supplier.controller';
import { isAuthenticated } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Apply authentication middleware to all supplier routes
router.use(isAuthenticated);

// Get all suppliers
router.get(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  supplierController.getAllSuppliers
);

// Create a new supplier
router.post(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager']),
  supplierController.createSupplier
);

// Get a single supplier by ID
router.get(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  supplierController.getSupplierById
);

// Update a supplier
router.patch(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager']),
  supplierController.updateSupplier
);

// Delete a supplier
router.delete(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager']),
  supplierController.deleteSupplier
);

export default router;
