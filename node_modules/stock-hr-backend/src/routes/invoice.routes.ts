import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest.middleware';
import { invoiceSchema } from '../validators/invoice.validator';
import { AuthRequest } from '../types/authRequest';

const router = Router();
const invoiceController = new InvoiceController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create new invoice (proforma or final)
router.post(
  '/',
  validateRequest(invoiceSchema),
  (req, res) => InvoiceController.createInvoice(req as AuthRequest, res)
);

// Get all invoices
router.get('/', (req, res) => InvoiceController.getInvoices(req as AuthRequest, res));

// Get invoice by ID
router.get('/:id', (req, res) => InvoiceController.getInvoiceById(req as AuthRequest, res));

// Update invoice
router.put(
  '/:id',
  validateRequest(invoiceSchema),
  (req, res) => InvoiceController.updateInvoice(req as AuthRequest, res)
);

// Validate invoice (only for final invoices)
router.post('/:id/validate', (req, res) => InvoiceController.validateInvoice(req as AuthRequest, res));

// Convert proforma to final invoice
router.post('/:id/convert', (req, res) => InvoiceController.convertProformaToInvoice(req as AuthRequest, res));

// Generate PDF
router.get('/:id/pdf', (req, res, next) => invoiceController.generatePDF(req as AuthRequest, res, next));

// Delete invoice
router.delete('/:id', (req, res) => InvoiceController.deleteInvoice(req as AuthRequest, res));

export default router; 