import express from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { inventoryValidation } from '../validation/inventory.validation';
import { validateRequest } from '../middleware/validate.middleware';
import { protect, restrictTo } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(inventoryController.getAllInventory)
  .post(validateRequest(inventoryValidation.createInventory), inventoryController.createInventory);

router
  .route('/:id')
  .get(inventoryController.getInventory)
  .patch(validateRequest(inventoryValidation.updateInventory), inventoryController.updateInventory)
  .delete(inventoryController.deleteInventory);

export default router; 