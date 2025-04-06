import { Request, Response, NextFunction } from 'express';
import { PurchaseOrder } from '../models/purchaseOrder.model';
import { InventoryItem } from '../models/inventory.model';
import { StockMovement } from '../models/stockMovement.model';
import { PurchaseOrderAccessToken } from '../models/purchaseOrderAccessToken.model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';
import mongoose from 'mongoose';

// Get all purchase orders with filters
export const getAllPurchaseOrders = catchAsync(async (req: Request, res: Response) => {
  const query: any = {};

  // Apply filters
  if (req.query.status) query.status = req.query.status;
  if (req.query.supplier) query.supplier = req.query.supplier;
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  const purchaseOrders = await PurchaseOrder.find(query)
    .populate('supplier', 'name')
    .populate('items.product', 'name sku')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    data: purchaseOrders,
  });
});

// Get single purchase order
export const getPurchaseOrder = catchAsync(async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id)
    .populate('supplier', 'name')
    .populate('items.product', 'name sku');
  
  if (!purchaseOrder) {
    throw new AppError(404, 'Purchase order not found');
  }

  res.status(200).json({
    status: 'success',
    data: purchaseOrder,
  });
});

// Create purchase order
export const createPurchaseOrder = catchAsync(async (req: Request, res: Response) => {
  const { items, supplier, expectedDeliveryDate } = req.body;

  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError(400, 'Purchase order must have at least one item');
  }

  // Check for duplicate products
  const productIds = items.map(item => item.product.toString());
  if (new Set(productIds).size !== productIds.length) {
    throw new AppError(400, 'Duplicate products are not allowed in the same order');
  }

  // Validate expected delivery date
  if (expectedDeliveryDate && new Date(expectedDeliveryDate) <= new Date()) {
    throw new AppError(400, 'Expected delivery date must be in the future');
  }

  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const purchaseOrder = await PurchaseOrder.create({
    ...req.body,
    total,
    status: 'pending',
  });
  
  res.status(201).json({
    status: 'success',
    data: purchaseOrder,
  });
});

// Update purchase order
export const updatePurchaseOrder = catchAsync(async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);

  if (!purchaseOrder) {
    throw new AppError(404, 'Purchase order not found');
  }

  // Don't allow updating items or total after creation
  if (req.body.items || req.body.total) {
    throw new AppError(400, 'Cannot update items or total of existing purchase order');
  }

  // Don't allow updating status through this endpoint
  if (req.body.status) {
    throw new AppError(400, 'Please use the status update endpoint to change status');
  }

  const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: updatedPurchaseOrder,
  });
});

// Update purchase order status
export const updatePurchaseOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status, receivedItems, accessToken } = req.body;
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)
      .populate('items.product');

    if (!purchaseOrder) {
      throw new AppError(404, 'Purchase order not found');
    }

    // Validate access token for operations that require exclusive access
    if (['received', 'cancelled'].includes(status)) {
      if (!accessToken) {
        throw new AppError(400, 'Access token is required for this operation');
      }

      const token = await PurchaseOrderAccessToken.findOne({
        token: accessToken,
        purchaseOrder: purchaseOrder._id,
        status: 'active'
      });

      if (!token) {
        throw new AppError(400, 'Invalid or expired access token');
      }

      if (token.user.toString() !== req.user._id.toString()) {
        throw new AppError(403, 'Not authorized to perform this operation');
      }

      if (token.operation !== (status === 'received' ? 'receive' : 'cancel')) {
        throw new AppError(400, 'Access token operation does not match requested operation');
      }
    }

    // Handle status transition
    if (status === 'received' && purchaseOrder.status !== 'approved') {
      throw new AppError(400, 'Purchase order must be approved before receiving');
    }

    // If receiving the order, update inventory
    if (status === 'received' && purchaseOrder.status !== 'received') {
      const itemsToProcess = receivedItems || purchaseOrder.items;

      for (const item of itemsToProcess) {
        const orderItem = purchaseOrder.items.find(
          oi => oi.product.toString() === item.product.toString()
        );

        if (!orderItem) {
          throw new AppError(400, `Product ${item.product} not found in order`);
        }

        const product = item.product as any;
        const quantity = item.quantity || orderItem.quantity;
        
        // Validate quantity
        if (quantity <= 0) {
          throw new AppError(400, 'Received quantity must be greater than 0');
        }
        if (quantity > orderItem.quantity) {
          throw new AppError(400, 'Received quantity cannot exceed ordered quantity');
        }

        // Update inventory quantity
        await InventoryItem.findByIdAndUpdate(
          product._id,
          { $inc: { quantity: quantity } },
          { session }
        );

        // Create stock movement
        await StockMovement.create([{
          inventoryItem: product._id,
          quantity,
          type: 'in',
          source: purchaseOrder.supplier.toString(),
          reference: `PO-${purchaseOrder._id}`,
          user: req.user?._id,
          notes: `Received from PO ${purchaseOrder._id}`,
        }], { session });
      }

      // Update order status
      purchaseOrder.status = 'received';
      purchaseOrder.receivedAt = new Date();
      await purchaseOrder.save({ session });

      // Complete the access token
      if (accessToken) {
        await PurchaseOrderAccessToken.findOneAndUpdate(
          { token: accessToken },
          { status: 'completed' },
          { session }
        );
      }
    } else {
      purchaseOrder.status = status;
      await purchaseOrder.save({ session });

      // Complete the access token for cancellation
      if (status === 'cancelled' && accessToken) {
        await PurchaseOrderAccessToken.findOneAndUpdate(
          { token: accessToken },
          { status: 'completed' },
          { session }
        );
      }
    }

    await session.commitTransaction();

    res.status(200).json({
      status: 'success',
      data: purchaseOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Delete purchase order
export const deletePurchaseOrder = catchAsync(async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);

  if (!purchaseOrder) {
    throw new AppError(404, 'Purchase order not found');
  }

  // Don't allow deleting received orders
  if (purchaseOrder.status === 'received') {
    throw new AppError(400, 'Cannot delete received purchase order');
  }

  await purchaseOrder.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
}); 