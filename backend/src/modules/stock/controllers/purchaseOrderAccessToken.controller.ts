import { Request, Response, NextFunction } from 'express';
import { PurchaseOrderAccessToken } from '../models/purchaseOrderAccessToken.model';
import { PurchaseOrder } from '../models/purchaseOrder.model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';

// Request access token
export const requestAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { purchaseOrder, operation, items } = req.body;

  // Check if purchase order exists and is in correct status
  const order = await PurchaseOrder.findById(purchaseOrder);
  if (!order) {
    return next(new AppError('Purchase order not found', 404));
  }

  // Validate operation based on current status
  if (operation === 'receive' && order.status !== 'approved') {
    return next(new AppError('Purchase order must be approved before receiving', 400));
  }

  if (operation === 'approve' && order.status !== 'pending') {
    return next(new AppError('Purchase order must be pending before approval', 400));
  }

  if (operation === 'cancel' && ['completed', 'cancelled'].includes(order.status)) {
    return next(new AppError('Cannot cancel a completed or already cancelled order', 400));
  }

  // Validate items if provided
  if (items && items.length > 0) {
    for (const item of items) {
      const orderItem = order.items.find(oi => oi.product.toString() === item.product.toString());
      if (!orderItem) {
        return next(new AppError(`Product ${item.product} not found in order`, 400));
      }
      if (item.quantity > orderItem.quantity) {
        return next(new AppError(`Received quantity cannot exceed ordered quantity for product ${item.product}`, 400));
      }
    }
  }

  // Check for existing active tokens
  const existingToken = await PurchaseOrderAccessToken.findOne({
    purchaseOrder,
    status: 'active'
  });

  if (existingToken) {
    return next(new AppError('Another user is currently accessing this purchase order', 409));
  }

  // Create new access token
  const token = await PurchaseOrderAccessToken.create({
    purchaseOrder,
    user: req.user._id,
    operation,
    items: items || [],
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
  });

  res.status(201).json({
    status: 'success',
    data: {
      token: {
        token: token.token,
        expiresAt: token.expiresAt,
        operation: token.operation,
        items: token.items
      }
    }
  });
});

// Release access token
export const releaseAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  const accessToken = await PurchaseOrderAccessToken.findOne({ token });
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

  const accessToken = await PurchaseOrderAccessToken.findOne({ token });
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

// Get active access token for a purchase order
export const getActiveAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { purchaseOrder } = req.params;

  const accessToken = await PurchaseOrderAccessToken.findOne({
    purchaseOrder,
    status: 'active'
  });

  if (!accessToken) {
    return next(new AppError('No active access token found for this purchase order', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      token: {
        token: accessToken.token,
        expiresAt: accessToken.expiresAt,
        operation: accessToken.operation,
        items: accessToken.items
      }
    }
  });
}); 