import { Request, Response, NextFunction } from 'express';
import { Supplier } from '../models/supplier.model';
import { ISupplierInput, ISupplierUpdate, ISupplierFilters } from '../interfaces/supplier.interface';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const supplierController = {
  // Get all suppliers with filtering, sorting, and pagination
  getAllSuppliers: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      search,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query as unknown as ISupplierFilters;

    // Build query
    const query: any = {};

    // Apply filters
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Count total documents for pagination
    const totalDocs = await Supplier.countDocuments(query);

    // Apply pagination
    const skip = (page - 1) * limit;

    // Apply sorting
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const suppliers = await Supplier.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      results: suppliers.length,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
      data: {
        suppliers
      }
    });
  }),

  // Get a single supplier by ID
  getSupplierById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return next(new AppError('No supplier found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        supplier
      }
    });
  }),

  // Create a new supplier
  createSupplier: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const supplierData: ISupplierInput = req.body;

    // Check if code is provided and unique
    if (supplierData.code) {
      const existingSupplier = await Supplier.findOne({ code: supplierData.code });
      if (existingSupplier) {
        return next(new AppError('A supplier with this code already exists', 400));
      }
    }

    // Check if email is provided and unique
    if (supplierData.email) {
      const existingSupplier = await Supplier.findOne({ email: supplierData.email });
      if (existingSupplier) {
        return next(new AppError('A supplier with this email already exists', 400));
      }
    }

    const newSupplier = await Supplier.create({
      ...supplierData,
      createdBy: req.user?._id || 'system',
      updatedBy: req.user?._id || 'system'
    });

    res.status(201).json({
      status: 'success',
      data: {
        supplier: newSupplier
      }
    });
  }),

  // Update a supplier
  updateSupplier: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const supplierData: ISupplierUpdate = {
      ...req.body,
      updatedBy: req.user?._id || 'system'
    };

    // Check if code is being updated and is unique
    if (supplierData.code) {
      const existingSupplier = await Supplier.findOne({
        code: supplierData.code,
        _id: { $ne: req.params.id }
      });
      if (existingSupplier) {
        return next(new AppError('A supplier with this code already exists', 400));
      }
    }

    // Check if email is being updated and is unique
    if (supplierData.email) {
      const existingSupplier = await Supplier.findOne({
        email: supplierData.email,
        _id: { $ne: req.params.id }
      });
      if (existingSupplier) {
        return next(new AppError('A supplier with this email already exists', 400));
      }
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      supplierData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedSupplier) {
      return next(new AppError('No supplier found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        supplier: updatedSupplier
      }
    });
  }),

  // Delete a supplier (soft delete by setting isActive to false)
  deleteSupplier: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Check if supplier has products
    // This would require a Product model check
    // const hasProducts = await Product.exists({ supplier: req.params.id, isActive: true });
    // if (hasProducts) {
    //   return next(new AppError('Cannot delete a supplier that has active products', 400));
    // }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        updatedBy: req.user?._id || 'system'
      },
      {
        new: true
      }
    );

    if (!supplier) {
      return next(new AppError('No supplier found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  })
};
