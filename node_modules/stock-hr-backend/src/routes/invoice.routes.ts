import express from 'express';
import { invoiceController } from '../controllers/invoice.controller';
import { invoiceValidation } from '../validation/invoice.validation';
import { validateRequest } from '../middleware/validate.middleware';
import { protect, restrictTo } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(invoiceController.getAllInvoices)
  .post(validateRequest(invoiceValidation.createInvoice), invoiceController.createInvoice);

router
  .route('/:id')
  .get(invoiceController.getInvoice)
  .patch(validateRequest(invoiceValidation.updateInvoice), invoiceController.updateInvoice)
  .delete(invoiceController.deleteInvoice);

router.post('/:id/generate', invoiceController.generateInvoice);

export default router; 