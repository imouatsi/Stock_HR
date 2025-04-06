import { Request, Response } from 'express';
import { StockMovement } from '../models/stockMovement.model';
import { InventoryItem } from '../models/inventory.model';
import { StockAccessToken } from '../models/stockAccessToken.model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';
import mongoose from 'mongoose';

// Get all movements with filters
export const getAllMovements = catchAsync(async (req: Request, res: Response) => {
  const query: any = {};

  // Apply filters
  if (req.query.type) query.type = req.query.type;
  if (req.query.status) query.status = req.query.status;
  if (req.query.inventoryItem) query.inventoryItem = req.query.inventoryItem;
  if (req.query.startDate && req.query.endDate) {
    query.timestamp = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  // Apply pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [movements, total] = await Promise.all([
    StockMovement.find(query)
      .populate('inventoryItem', 'name sku')
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
    StockMovement.countDocuments(query),
  ]);

  res.status(200).json({
    status: 'success',
    data: movements,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// Get single movement
export const getMovement = catchAsync(async (req: Request, res: Response) => {
  const movement = await StockMovement.findById(req.params.id)
    .populate('inventoryItem', 'name sku')
    .populate('user', 'name email');
  
  if (!movement) {
    throw new AppError(404, 'Stock movement not found');
  }

  res.status(200).json({
    status: 'success',
    data: movement,
  });
});

// Create movement
export const createMovement = catchAsync(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { inventoryItem, quantity, type, source, destination, notes, timestamp, accessToken } = req.body;

    // Validate quantity
    if (quantity <= 0) {
      throw new AppError(400, 'Quantity must be greater than 0');
    }

    // Validate source/destination for transfer
    if (type === 'transfer') {
      if (!source || !destination) {
        throw new AppError(400, 'Source and destination are required for transfers');
      }
      if (source === destination) {
        throw new AppError(400, 'Source and destination cannot be the same');
      }
    }

    // Check inventory item exists
    const item = await InventoryItem.findById(inventoryItem);
    if (!item) {
      throw new AppError(404, 'Inventory item not found');
    }

    // For outgoing movements, validate access token
    if (type === 'out') {
      if (!accessToken) {
        throw new AppError(400, 'Access token is required for outgoing movements');
      }

      const token = await StockAccessToken.findOne({ 
        token: accessToken,
        status: 'active',
        inventoryItem,
        operation: 'sale'
      });

      if (!token) {
        throw new AppError(400, 'Invalid or expired access token');
      }

      if (token.user.toString() !== req.user?._id.toString()) {
        throw new AppError(403, 'Not authorized to use this access token');
      }

      if (token.quantity !== quantity) {
        throw new AppError(400, 'Token quantity does not match movement quantity');
      }

      // Check sufficient stock for outgoing movements
      if (item.quantity < quantity) {
        throw new AppError(400, 'Insufficient stock available');
      }
    }

    // Create movement
    const movement = await StockMovement.create([{
      inventoryItem,
      quantity,
      type,
      source,
      destination,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      user: req.user?._id,
      notes,
      status: 'pending',
    }], { session });

    // Update inventory
    const quantityChange = type === 'in' ? quantity : -quantity;
    await InventoryItem.findByIdAndUpdate(
      inventoryItem,
      { $inc: { quantity: quantityChange } },
      { session }
    );

    // Complete the movement
    movement[0].status = 'completed';
    await movement[0].save({ session });

    // If this was an outgoing movement, complete the access token
    if (type === 'out' && accessToken) {
      await StockAccessToken.findOneAndUpdate(
        { token: accessToken },
        { status: 'completed' },
        { session }
      );
    }

    await session.commitTransaction();

    res.status(201).json({
      status: 'success',
      data: movement[0],
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Update movement
export const updateMovement = catchAsync(async (req: Request, res: Response) => {
  const movement = await StockMovement.findById(req.params.id);

  if (!movement) {
    throw new AppError(404, 'Stock movement not found');
  }

  // Don't allow updating completed movements
  if (movement.status === 'completed') {
    throw new AppError(400, 'Cannot update completed movements');
  }

  // Don't allow updating quantity or type after creation
  if (req.body.quantity || req.body.type) {
    throw new AppError(400, 'Cannot update quantity or type of existing movement');
  }

  const updatedMovement = await StockMovement.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: updatedMovement,
  });
});

// Cancel movement
export const cancelMovement = catchAsync(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movement = await StockMovement.findById(req.params.id);

    if (!movement) {
      throw new AppError(404, 'Stock movement not found');
    }

    // Don't allow cancelling completed movements
    if (movement.status === 'completed') {
      throw new AppError(400, 'Cannot cancel completed movements');
    }

    // Reverse the inventory update if movement was pending
    if (movement.status === 'pending') {
      const quantityChange = movement.type === 'in' ? -movement.quantity : movement.quantity;
      await InventoryItem.findByIdAndUpdate(
        movement.inventoryItem,
        { $inc: { quantity: quantityChange } },
        { session }
      );
    }

    movement.status = 'cancelled';
    await movement.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      status: 'success',
      data: movement,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Delete movement
export const deleteMovement = catchAsync(async (req: Request, res: Response) => {
  const movement = await StockMovement.findById(req.params.id);

  if (!movement) {
    throw new AppError(404, 'Stock movement not found');
  }

  // Don't allow deleting completed movements
  if (movement.status === 'completed') {
    throw new AppError(400, 'Cannot delete completed movements');
  }

  await movement.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
}); 