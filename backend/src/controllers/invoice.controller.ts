import { Request, Response, NextFunction } from 'express';
import Invoice from '../models/invoice.model';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/authRequest';
import Proforma from '../models/proforma.model';
import { Company } from '../models/company.model';
import { InventoryItem } from '../models/inventory.model';
import { PDFService } from '../services/pdf.service';

export const getAllInvoices = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: invoices.length,
      data: {
        invoices
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return next(new AppError('Invoice not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        invoice
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Generate invoice number
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;

    const invoice = await Invoice.create({
      ...req.body,
      invoiceNumber,
      createdBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        invoice
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!invoice) {
      return next(new AppError('Invoice not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        invoice
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return next(new AppError('Invoice not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

export class InvoiceController {
  // Create a new invoice (proforma or final)
  public static async createInvoice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type, client, items, paymentTerms, dueDate } = req.body;

      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      // Get company details
      const company = await Company.findOne();
      if (!company) {
        res.status(400).json({ message: 'Company details not found. Please set up company information first.' });
        return;
      }

      // Generate invoice number
      const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
      const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) : 0;
      const invoiceNumber = `INV-${String(lastNumber + 1).padStart(6, '0')}`;

      // Create invoice
      const invoice = new Invoice({
        invoiceNumber,
        type,
        company: {
          name: company.name,
          address: company.address,
          nif: company.nif,
        },
        client,
        items,
        paymentTerms,
        dueDate,
        createdBy: req.user.id,
      });

      await invoice.save();
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Error creating invoice', error });
    }
  }

  // Get all invoices
  public static async getInvoices(_req: Request, res: Response): Promise<void> {
    try {
      const invoices = await Invoice.find()
        .sort({ createdAt: -1 })
        .populate('createdBy', 'firstName lastName');

      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching invoices', error });
    }
  }

  // Get invoice by ID
  public static async getInvoiceById(req: Request, res: Response): Promise<void> {
    try {
      const invoice = await Invoice.findById(req.params.id)
        .populate('createdBy', 'firstName lastName');

      if (!invoice) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }

      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching invoice', error });
    }
  }

  // Update invoice
  public static async updateInvoice(req: Request, res: Response): Promise<void> {
    try {
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }

      // Don't allow updates if invoice is validated
      if (invoice.status === 'validated') {
        res.status(400).json({ message: 'Cannot update a validated invoice' });
        return;
      }

      const updatedInvoice = await Invoice.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json(updatedInvoice);
    } catch (error) {
      res.status(500).json({ message: 'Error updating invoice', error });
    }
  }

  // Validate invoice (only for final invoices)
  public static async validateInvoice(req: Request, res: Response): Promise<void> {
    try {
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }

      if (invoice.type !== 'final') {
        res.status(400).json({ message: 'Only final invoices can be validated' });
        return;
      }

      if (invoice.status === 'validated') {
        res.status(400).json({ message: 'Invoice is already validated' });
        return;
      }

      // Update inventory
      for (const item of invoice.items) {
        const inventoryItem = await InventoryItem.findOne({ name: item.description });
        if (!inventoryItem) {
          res.status(400).json({ message: `Product ${item.description} not found in inventory` });
          return;
        }

        if (inventoryItem.quantity < item.quantity) {
          res.status(400).json({ message: `Insufficient quantity for product ${item.description}` });
          return;
        }

        inventoryItem.quantity -= item.quantity;
        await inventoryItem.save();
      }

      // Update invoice status
      invoice.status = 'validated';
      await invoice.save();

      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Error validating invoice', error });
    }
  }

  // Convert proforma to final invoice
  public static async convertProformaToInvoice(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const proforma = await Proforma.findById(req.params.id);

      if (!proforma) {
        res.status(404).json({ message: 'Proforma invoice not found' });
        return;
      }

      // Generate invoice number
      const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
      const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) : 0;
      const invoiceNumber = `INV-${String(lastNumber + 1).padStart(6, '0')}`;

      // Create final invoice from proforma
      const invoice = new Invoice({
        invoiceNumber,
        type: 'final',
        company: proforma.company,
        client: proforma.client,
        items: proforma.items,
        paymentTerms: proforma.paymentTerms,
        dueDate: new Date(),
        createdBy: req.user.id,
      });

      await invoice.save();
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Error converting proforma to invoice', error });
    }
  }

  // Generate PDF
  public static async generatePDF(req: Request, res: Response): Promise<void> {
    try {
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }

      const company = await Company.findOne();
      if (!company) {
        res.status(400).json({ message: 'Company details not found' });
        return;
      }

      const filePath = await PDFService.generateInvoicePDF(invoice, company);
      res.download(filePath);
    } catch (error) {
      res.status(500).json({ message: 'Error generating PDF', error });
    }
  }

  // Delete invoice
  public static async deleteInvoice(req: Request, res: Response): Promise<void> {
    try {
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }

      // Don't allow deletion if invoice is validated
      if (invoice.status === 'validated') {
        res.status(400).json({ message: 'Cannot delete a validated invoice' });
        return;
      }

      await Invoice.findByIdAndDelete(req.params.id);
      res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting invoice', error });
    }
  }
} 