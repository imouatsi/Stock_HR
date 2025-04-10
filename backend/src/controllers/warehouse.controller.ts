import { Request, Response, NextFunction } from 'express';
import { Warehouse } from '../models/warehouse.model';
import { IWarehouseInput, IWarehouseUpdate, IWarehouseFilters } from '../interfaces/warehouse.interface';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const warehouseController = {
  // Get all warehouses with filtering, sorting, and pagination
  getAllWarehouses: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      search,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query as unknown as IWarehouseFilters;

    // Build query
    const query: any = {};

    // Apply filters
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Count total documents for pagination
    const totalDocs = await Warehouse.countDocuments(query);

    // Apply pagination
    const skip = (page - 1) * limit;

    // Apply sorting
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const warehouses = await Warehouse.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('manager', 'name email');

    res.status(200).json({
      status: 'success',
      results: warehouses.length,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
      data: {
        warehouses
      }
    });
  }),

  // Get a single warehouse by ID
  getWarehouseById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const warehouse = await Warehouse.findById(req.params.id)
      .populate('manager', 'name email');

    if (!warehouse) {
      return next(new AppError('No warehouse found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        warehouse
      }
    });
  }),

  // Create a new warehouse
  createWarehouse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const warehouseData: IWarehouseInput = req.body;

    // Check if code is provided and unique
    if (warehouseData.code) {
      const existingWarehouse = await Warehouse.findOne({ code: warehouseData.code });
      if (existingWarehouse) {
        return next(new AppError('A warehouse with this code already exists', 400));
      }
    }

    const newWarehouse = await Warehouse.create({
      ...warehouseData,
      createdBy: req.user?._id || 'system',
      updatedBy: req.user?._id || 'system'
    });

    res.status(201).json({
      status: 'success',
      data: {
        warehouse: newWarehouse
      }
    });
  }),

  // Update a warehouse
  updateWarehouse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const warehouseData: IWarehouseUpdate = {
      ...req.body,
      updatedBy: req.user?._id || 'system'
    };

    // Check if code is being updated and is unique
    if (warehouseData.code) {
      const existingWarehouse = await Warehouse.findOne({
        code: warehouseData.code,
        _id: { $ne: req.params.id }
      });
      if (existingWarehouse) {
        return next(new AppError('A warehouse with this code already exists', 400));
      }
    }

    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      warehouseData,
      {
        new: true,
        runValidators: true
      }
    ).populate('manager', 'name email');

    if (!updatedWarehouse) {
      return next(new AppError('No warehouse found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        warehouse: updatedWarehouse
      }
    });
  }),

  // Delete a warehouse (soft delete by setting isActive to false)
  deleteWarehouse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        updatedBy: req.user?._id || 'system'
      },
      {
        new: true
      }
    );

    if (!warehouse) {
      return next(new AppError('No warehouse found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  }),

  // Get warehouses by manager
  getWarehousesByManager: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const warehouses = await Warehouse.find({
      manager: req.params.managerId,
      isActive: true
    }).populate('manager', 'name email');

    res.status(200).json({
      status: 'success',
      results: warehouses.length,
      data: {
        warehouses
      }
    });
  })
};
