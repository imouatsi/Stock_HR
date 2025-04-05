import express from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest.middleware';
import { invoiceSchema } from '../validators/invoice.validator';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create new invoice (proforma or final)
router.post(
  '/',
  validateRequest(invoiceSchema),
  InvoiceController.createInvoice
);

// Get all invoices
router.get('/', InvoiceController.getInvoices);

// Get invoice by ID
router.get('/:id', InvoiceController.getInvoiceById);

// Update invoice
router.put(
  '/:id',
  validateRequest(invoiceSchema),
  InvoiceController.updateInvoice
);

// Validate invoice (only for final invoices)
router.post('/:id/validate', InvoiceController.validateInvoice);

// Convert proforma to final invoice
router.post('/:id/convert', InvoiceController.convertProformaToInvoice);

// Generate PDF
router.get('/:id/pdf', InvoiceController.generatePDF);

// Delete invoice
router.delete('/:id', InvoiceController.deleteInvoice);

export default router; 