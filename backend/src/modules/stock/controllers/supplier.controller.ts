import { Request, Response } from 'express';
import { Supplier } from '../models/supplier.model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';

// Get all suppliers
export const getAllSuppliers = catchAsync(async (req: Request, res: Response) => {
  const suppliers = await Supplier.find().sort({ name: 1 });
  res.status(200).json({
    status: 'success',
    data: suppliers,
  });
});

// Get single supplier
export const getSupplier = catchAsync(async (req: Request, res: Response) => {
  const supplier = await Supplier.findById(req.params.id);
  
  if (!supplier) {
    throw new AppError(404, 'Supplier not found');
  }

  res.status(200).json({
    status: 'success',
    data: supplier,
  });
});

// Create supplier
export const createSupplier = catchAsync(async (req: Request, res: Response) => {
  const supplier = await Supplier.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: supplier,
  });
});

// Update supplier
export const updateSupplier = catchAsync(async (req: Request, res: Response) => {
  const supplier = await Supplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!supplier) {
    throw new AppError(404, 'Supplier not found');
  }

  res.status(200).json({
    status: 'success',
    data: supplier,
  });
});

// Delete supplier
export const deleteSupplier = catchAsync(async (req: Request, res: Response) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);

  if (!supplier) {
    throw new AppError(404, 'Supplier not found');
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Toggle supplier active status
export const toggleSupplierStatus = catchAsync(async (req: Request, res: Response) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    throw new AppError(404, 'Supplier not found');
  }

  supplier.isActive = !supplier.isActive;
  await supplier.save();

  res.status(200).json({
    status: 'success',
    data: supplier,
  });
}); 