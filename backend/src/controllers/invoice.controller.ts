import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../models/invoice.model';
import { AppError } from '../utils/appError';

export const invoiceController = {
  async getAllInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const invoices = await Invoice.find();
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
  },

  async getInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await Invoice.findById(req.params.id);
      if (!invoice) {
        return next(new AppError('No invoice found with that ID', 404));
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
  },

  async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { number, date, dueDate, amount, status, company, items } = req.body;

      const newInvoice = await Invoice.create({
        number,
        date,
        dueDate,
        amount,
        status,
        company,
        items
      });

      res.status(201).json({
        status: 'success',
        data: {
          invoice: newInvoice
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { number, date, dueDate, amount, status, company, items } = req.body;

      const invoice = await Invoice.findByIdAndUpdate(
        req.params.id,
        {
          number,
          date,
          dueDate,
          amount,
          status,
          company,
          items
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!invoice) {
        return next(new AppError('No invoice found with that ID', 404));
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
  },

  async deleteInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await Invoice.findByIdAndDelete(req.params.id);
      if (!invoice) {
        return next(new AppError('No invoice found with that ID', 404));
      }
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  },

  async generateInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await Invoice.findById(req.params.id);
      if (!invoice) {
        return next(new AppError('No invoice found with that ID', 404));
      }

      // TODO: Implement invoice generation logic
      res.status(200).json({
        status: 'success',
        message: 'Invoice generated successfully',
        data: {
          invoice
        }
      });
    } catch (error) {
      next(error);
    }
  }
}; 