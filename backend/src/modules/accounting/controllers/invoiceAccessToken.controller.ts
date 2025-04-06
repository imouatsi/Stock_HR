import { Request, Response, NextFunction } from 'express';
import { InvoiceAccessToken } from '../models/invoiceAccessToken.model';
import { Invoice } from '../models/invoice.model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';

// Request access token
export const requestAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { invoice, operation, details } = req.body;

  // Check if invoice exists
  const invoiceDoc = await Invoice.findById(invoice);
  if (!invoiceDoc) {
    return next(new AppError('Invoice not found', 404));
  }

  // Validate operation based on current status
  if (operation === 'payment') {
    if (!details.amount || details.amount <= 0) {
      return next(new AppError('Valid payment amount is required', 400));
    }
    
    if (!details.paymentMethod) {
      return next(new AppError('Payment method is required', 400));
    }
    
    // Check if invoice is already paid
    if (invoiceDoc.status === 'paid') {
      return next(new AppError('Invoice is already paid', 400));
    }
  }

  if (operation === 'cancellation') {
    if (!details.reason) {
      return next(new AppError('Reason is required for cancellation', 400));
    }
    
    // Check if invoice can be cancelled
    if (['paid', 'cancelled'].includes(invoiceDoc.status)) {
      return next(new AppError('Invoice cannot be cancelled in its current state', 400));
    }
  }

  if (operation === 'approval' && invoiceDoc.status !== 'pending') {
    return next(new AppError('Only pending invoices can be approved', 400));
  }

  // Check for existing active tokens
  const existingToken = await InvoiceAccessToken.findOne({
    invoice,
    status: 'active'
  });

  if (existingToken) {
    return next(new AppError('Another user is currently accessing this invoice', 409));
  }

  // Create new access token
  const token = await InvoiceAccessToken.create({
    invoice,
    user: req.user._id,
    operation,
    details,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
  });

  res.status(201).json({
    status: 'success',
    data: {
      token: {
        token: token.token,
        expiresAt: token.expiresAt,
        operation: token.operation,
        details: token.details
      }
    }
  });
});

// Release access token
export const releaseAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  const accessToken = await InvoiceAccessToken.findOne({ token });
  if (!accessToken) {
    return next(new AppError('Access token not found', 404));
  }

  if (accessToken.user.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to release this token', 403));
  }

  accessToken.status = 'completed';
  await accessToken.save();

  res.status(200).json({
    status: 'success',
    data: null
  });
});

// Cancel access token
export const cancelAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  const accessToken = await InvoiceAccessToken.findOne({ token });
  if (!accessToken) {
    return next(new AppError('Access token not found', 404));
  }

  if (accessToken.user.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to cancel this token', 403));
  }

  accessToken.status = 'cancelled';
  await accessToken.save();

  res.status(200).json({
    status: 'success',
    data: null
  });
});

// Get active access token for an invoice
export const getActiveAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { invoice } = req.params;

  const accessToken = await InvoiceAccessToken.findOne({
    invoice,
    status: 'active'
  });

  if (!accessToken) {
    return next(new AppError('No active access token found for this invoice', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      token: {
        token: accessToken.token,
        expiresAt: accessToken.expiresAt,
        operation: accessToken.operation,
        details: accessToken.details
      }
    }
  });
}); 