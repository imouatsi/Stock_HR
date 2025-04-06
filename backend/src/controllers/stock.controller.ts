import { Request, Response, NextFunction } from 'express';
import { Stock } from '../models/stock.model';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

class StockController {
  createStock = catchAsync(async (req: Request, res: Response) => {
    const stock = await Stock.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { stock }
    });
  });

  getAllStocks = catchAsync(async (req: Request, res: Response) => {
    const stocks = await Stock.find();
    res.status(200).json({
      status: 'success',
      results: stocks.length,
      data: { stocks }
    });
  });

  getStock = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return next(new AppError('No stock found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { stock }
    });
  });

  updateStock = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!stock) {
      return next(new AppError('No stock found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { stock }
    });
  });

  deleteStock = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return next(new AppError('No stock found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
}

export const stockController = new StockController(); 