import express from 'express';
import { inventoryController } from '../controllers/inventory.controller';
// import { inventoryValidation } from '../validation/inventory.validation';
// import { validateRequest } from '../middleware/validate.middleware';
// import { protect, restrictTo } from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Protect all routes
router.use(isAuthenticated);

router
  .route('/')
  .get(inventoryController.getAllInventory)
  .post(inventoryController.createInventory);

router
  .route('/:id')
  .get(inventoryController.getInventory)
  .patch(inventoryController.updateInventory)
  .delete(inventoryController.deleteInventory);

export default router;