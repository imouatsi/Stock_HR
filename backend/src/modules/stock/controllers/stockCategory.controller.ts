import { Request, Response } from 'express';
import { StockCategory } from '../models/stockCategory.model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';

// Get all categories
export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await StockCategory.find().sort({ name: 1 });
  res.status(200).json({
    status: 'success',
    data: categories,
  });
});

// Get single category
export const getCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await StockCategory.findById(req.params.id);
  
  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

// Create category
export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await StockCategory.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: category,
  });
});

// Update category
export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await StockCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

// Delete category
export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await StockCategory.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
}); 