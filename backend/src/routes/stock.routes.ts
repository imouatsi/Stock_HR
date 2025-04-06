import { Router } from 'express';
import { stockController } from '../controllers/stock.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { stockValidation } from '../validation/stock.validation';

const router = Router();

// Protected routes
router.use(authMiddleware.protect);

router
  .route('/')
  .get(stockController.getAllStocks)
  .post(validateRequest(stockValidation.createStock), stockController.createStock);

router
  .route('/:id')
  .get(stockController.getStock)
  .patch(validateRequest(stockValidation.updateStock), stockController.updateStock)
  .delete(stockController.deleteStock);

export default router; 