import { Request, Response, NextFunction } from 'express';
import Invoice from '../models/invoice.model';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/authRequest';

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