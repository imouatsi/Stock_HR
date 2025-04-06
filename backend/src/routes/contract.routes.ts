import express from 'express';
import { contractController } from '../controllers/contract.controller';
import { contractValidation } from '../validation/contract.validation';
import { validateRequest } from '../middleware/validate.middleware';
import { protect, restrictTo } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(contractController.getAllContracts)
  .post(validateRequest(contractValidation.createContract), contractController.createContract);

router
  .route('/:id')
  .get(contractController.getContract)
  .patch(validateRequest(contractValidation.updateContract), contractController.updateContract)
  .delete(contractController.deleteContract);

router.post('/:id/generate', contractController.generateContract);

export default router; 