import express from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from '../controllers/invoice.controller';

const router = express.Router();

// Get all invoices
router.get('/', getAllInvoices);

// Get a single invoice by ID
router.get('/:id', getInvoiceById);

// Create a new invoice
router.post('/', createInvoice);

// Update an invoice
router.put('/:id', updateInvoice);

// Delete an invoice
router.delete('/:id', deleteInvoice);

export default router; 