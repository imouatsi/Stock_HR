import { Request, Response, NextFunction } from 'express';
import { StockItem } from '../models/stock-item.model';
import { Product } from '../models/product.model';
import { Warehouse } from '../models/warehouse.model';
import { IStockItemInput, IStockItemUpdate, IStockItemFilters } from '../interfaces/stock-item.interface';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const stockItemController = {
  // Get all stock items with filtering, sorting, and pagination
  getAllStockItems: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      product,
      warehouse,
      lowStock,
      expired,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query as unknown as IStockItemFilters;

    // Build query
    const query: any = {};

    // Apply filters
    if (product) {
      query.product = product;
    }

    if (warehouse) {
      query.warehouse = warehouse;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Handle low stock filter
    if (lowStock) {
      // We need to join with the product to get the minQuantity
      const stockItems = await StockItem.find(query)
        .populate('product', 'minQuantity')
        .exec();

      const lowStockItems = stockItems.filter(item =>
        item.quantity <= item.minQuantity
      );

      return res.status(200).json({
        status: 'success',
        results: lowStockItems.length,
        data: {
          stockItems: lowStockItems
        }
      });
    }

    // Handle expired filter
    if (expired) {
      const now = new Date();
      query.expiryDate = { $lt: now };
    }

    // Count total documents for pagination
    const totalDocs = await StockItem.countDocuments(query);

    // Apply pagination
    const skip = (page - 1) * limit;

    // Apply sorting
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const stockItems = await StockItem.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('product', 'name code unit purchasePrice sellingPrice')
      .populate('warehouse', 'name code');

    res.status(200).json({
      status: 'success',
      results: stockItems.length,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
      data: {
        stockItems
      }
    });
  }),

  // Get a single stock item by ID
  getStockItemById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stockItem = await StockItem.findById(req.params.id)
      .populate('product', 'name code unit purchasePrice sellingPrice')
      .populate('warehouse', 'name code');

    if (!stockItem) {
      return next(new AppError('No stock item found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        stockItem
      }
    });
  }),

  // Create a new stock item
  createStockItem: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stockItemData: IStockItemInput = req.body;

    // Check if product exists
    const product = await Product.findById(stockItemData.product);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if warehouse exists
    const warehouse = await Warehouse.findById(stockItemData.warehouse);
    if (!warehouse) {
      return next(new AppError('Warehouse not found', 404));
    }

    // Check if product-warehouse-batch combination already exists
    const existingStockItem = await StockItem.findOne({
      product: stockItemData.product,
      warehouse: stockItemData.warehouse,
      batchNumber: stockItemData.batchNumber || null
    });

    if (existingStockItem) {
      return next(new AppError('A stock item with this product, warehouse, and batch number already exists', 400));
    }

    const newStockItem = await StockItem.create({
      ...stockItemData,
      createdBy: req.user?._id || 'system',
      updatedBy: req.user?._id || 'system'
    });

    // Populate references for response
    const populatedStockItem = await StockItem.findById(newStockItem._id)
      .populate('product', 'name code unit purchasePrice sellingPrice')
      .populate('warehouse', 'name code');

    res.status(201).json({
      status: 'success',
      data: {
        stockItem: populatedStockItem
      }
    });
  }),

  // Update a stock item
  updateStockItem: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stockItemData: IStockItemUpdate = {
      ...req.body,
      updatedBy: req.user?._id || 'system'
    };

    // Check if product exists if being updated
    if (stockItemData.product) {
      const product = await Product.findById(stockItemData.product);
      if (!product) {
        return next(new AppError('Product not found', 404));
      }
    }

    // Check if warehouse exists if being updated
    if (stockItemData.warehouse) {
      const warehouse = await Warehouse.findById(stockItemData.warehouse);
      if (!warehouse) {
        return next(new AppError('Warehouse not found', 404));
      }
    }

    // Check if product-warehouse-batch combination already exists if any of these are being updated
    if (stockItemData.product || stockItemData.warehouse || stockItemData.batchNumber !== undefined) {
      const currentStockItem = await StockItem.findById(req.params.id);
      if (!currentStockItem) {
        return next(new AppError('No stock item found with that ID', 404));
      }

      const existingStockItem = await StockItem.findOne({
        product: stockItemData.product || currentStockItem.product,
        warehouse: stockItemData.warehouse || currentStockItem.warehouse,
        batchNumber: stockItemData.batchNumber !== undefined ? stockItemData.batchNumber : currentStockItem.batchNumber,
        _id: { $ne: req.params.id }
      });

      if (existingStockItem) {
        return next(new AppError('A stock item with this product, warehouse, and batch number already exists', 400));
      }
    }

    const updatedStockItem = await StockItem.findByIdAndUpdate(
      req.params.id,
      stockItemData,
      {
        new: true,
        runValidators: true
      }
    ).populate('product', 'name code unit purchasePrice sellingPrice')
      .populate('warehouse', 'name code');

    if (!updatedStockItem) {
      return next(new AppError('No stock item found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        stockItem: updatedStockItem
      }
    });
  }),

  // Delete a stock item (soft delete by setting isActive to false)
  deleteStockItem: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stockItem = await StockItem.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        updatedBy: req.user?._id || 'system'
      },
      {
        new: true
      }
    );

    if (!stockItem) {
      return next(new AppError('No stock item found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  }),

  // Get stock items by product
  getStockItemsByProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stockItems = await StockItem.find({
      product: req.params.productId,
      isActive: true
    }).populate('product', 'name code unit purchasePrice sellingPrice')
      .populate('warehouse', 'name code');

    res.status(200).json({
      status: 'success',
      results: stockItems.length,
      data: {
        stockItems
      }
    });
  }),

  // Get stock items by warehouse
  getStockItemsByWarehouse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stockItems = await StockItem.find({
      warehouse: req.params.warehouseId,
      isActive: true
    }).populate('product', 'name code unit purchasePrice sellingPrice')
      .populate('warehouse', 'name code');

    res.status(200).json({
      status: 'success',
      results: stockItems.length,
      data: {
        stockItems
      }
    });
  }),

  // Get low stock items
  getLowStockItems: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stockItems = await StockItem.find({
      isActive: true
    }).populate('product', 'name code unit purchasePrice sellingPrice minQuantity')
      .populate('warehouse', 'name code');

    const lowStockItems = stockItems.filter(item =>
      item.quantity <= item.minQuantity
    );

    res.status(200).json({
      status: 'success',
      results: lowStockItems.length,
      data: {
        stockItems: lowStockItems
      }
    });
  }),

  // Get expired items
  getExpiredItems: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const now = new Date();
    const stockItems = await StockItem.find({
      expiryDate: { $lt: now },
      isActive: true
    }).populate('product', 'name code unit purchasePrice sellingPrice')
      .populate('warehouse', 'name code');

    res.status(200).json({
      status: 'success',
      results: stockItems.length,
      data: {
        stockItems
      }
    });
  })
};
