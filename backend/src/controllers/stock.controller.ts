import { Request, Response, NextFunction } from 'express';
import { StockItem } from '../models/stock.model';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

class StockController {
  createStockItem = catchAsync(async (req: Request, res: Response) => {
    const newItem = new StockItem({
      ...req.body,
      lastRestocked: new Date(),
      createdBy: req.user?._id,
    });
    await newItem.save();
    res.status(201).json(newItem);
  });

  getAllStockItems = catchAsync(async (req: Request, res: Response) => {
    const { search, category, sortBy = 'name', sortOrder = 'asc' } = req.query;

    let query = StockItem.find();

    // Apply search filter
    if (search) {
      query = query.or([
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]);
    }

    // Apply category filter
    if (category) {
      query = query.where('category').equals(category);
    }

    // Apply sorting
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    query = query.sort({ [sortBy as string]: sortDirection });

    const items = await query.exec();
    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items }
    });
  });

  getStockItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const item = await StockItem.findById(req.params.id);
    if (!item) {
      return next(new AppError('No stock item found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { item }
    });
  });

  updateStockItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const item = await StockItem.findById(req.params.id);
    if (!item) {
      return next(new AppError('No stock item found with that ID', 404));
    }

    // Update lastRestocked if quantity changed
    if (req.body.quantity !== item.quantity) {
      req.body.lastRestocked = new Date();
    }

    const updatedItem = await StockItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { item: updatedItem }
    });
  });

  deleteStockItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const item = await StockItem.findById(req.params.id);
    if (!item) {
      return next(new AppError('No stock item found with that ID', 404));
    }
    await StockItem.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await StockItem.distinct('category');
    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  });

  getSuppliers = catchAsync(async (req: Request, res: Response) => {
    const suppliers = await StockItem.distinct('supplier');
    res.status(200).json({
      status: 'success',
      data: { suppliers }
    });
  });
}

export const stockController = new StockController();