import { Request, Response, NextFunction } from 'express';
import { StockAccessToken } from '../models/stockAccessToken.model';
import { InventoryItem } from '../models/inventory.model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';

// Request access token
export const requestAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { inventoryItem, operation, quantity, details } = req.body;

  // Check if inventory item exists
  const item = await InventoryItem.findById(inventoryItem);
  if (!item) {
    return next(new AppError('Inventory item not found', 404));
  }

  // Validate operation based on current status
  if (operation === 'sale') {
    // Check if item is active
    if (item.status !== 'active') {
      return next(new AppError('Item is not available for sale', 400));
    }
    
    // Check if sufficient stock is available
    if (item.quantity < quantity) {
      return next(new AppError('Insufficient stock available', 400));
    }
  }

  if (operation === 'transfer') {
    if (!details?.destination) {
      return next(new AppError('Destination is required for transfer operation', 400));
    }
    
    // Check if sufficient stock is available
    if (item.quantity < quantity) {
      return next(new AppError('Insufficient stock available', 400));
    }
  }

  if (operation === 'adjustment') {
    if (!details?.reason) {
      return next(new AppError('Reason is required for adjustment operation', 400));
    }
  }

  // Check for existing active tokens
  const existingToken = await StockAccessToken.findOne({
    inventoryItem,
    status: 'active'
  });

  if (existingToken) {
    return next(new AppError('Another user is currently accessing this inventory item', 409));
  }

  // Create new access token
  const token = await StockAccessToken.create({
    inventoryItem,
    user: req.user._id,
    operation,
    quantity,
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
        quantity: token.quantity,
        details: token.details
      }
    }
  });
});

// Release access token
export const releaseAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  const accessToken = await StockAccessToken.findOne({ token });
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

  const accessToken = await StockAccessToken.findOne({ token });
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

// Get active access token for an inventory item
export const getActiveAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { inventoryItem } = req.params;

  const accessToken = await StockAccessToken.findOne({
    inventoryItem,
    status: 'active'
  });

  if (!accessToken) {
    return next(new AppError('No active access token found for this inventory item', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      token: {
        token: accessToken.token,
        expiresAt: accessToken.expiresAt,
        operation: accessToken.operation,
        quantity: accessToken.quantity,
        details: accessToken.details
      }
    }
  });
}); 