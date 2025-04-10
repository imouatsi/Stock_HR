import { Router } from 'express';
import { stockItemController } from '../controllers/stock-item.controller';
import { isAuthenticated } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Apply authentication middleware to all stock item routes
router.use(isAuthenticated);

// Get all stock items
router.get(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  stockItemController.getAllStockItems
);

// Create a new stock item
router.post(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager']),
  stockItemController.createStockItem
);

// Get a single stock item by ID
router.get(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  stockItemController.getStockItemById
);

// Update a stock item
router.patch(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager']),
  stockItemController.updateStockItem
);

// Delete a stock item
router.delete(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager']),
  stockItemController.deleteStockItem
);

// Get stock items by product
router.get(
  '/product/:productId',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  stockItemController.getStockItemsByProduct
);

// Get stock items by warehouse
router.get(
  '/warehouse/:warehouseId',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  stockItemController.getStockItemsByWarehouse
);

// Get low stock items
router.get(
  '/low-stock/all',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  stockItemController.getLowStockItems
);

// Get expired items
router.get(
  '/expired/all',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'auditor']),
  stockItemController.getExpiredItems
);

export default router;
