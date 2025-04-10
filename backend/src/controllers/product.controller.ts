import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { IProductInput, IProductUpdate, IProductFilters } from '../interfaces/product.interface';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { createProductSchema, updateProductSchema, productFilterSchema } from '../schemas/product.schema';

export const productController = {
  // Get all products with filtering, sorting, and pagination
  getAllProducts: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate query parameters
      const validatedFilters = productFilterSchema.parse(req.query);

      // Get products from service
      const { products, pagination } = await ProductService.getAllProducts(validatedFilters);

      res.status(200).json({
        status: 'success',
        results: products.length,
        ...pagination,
        data: {
          products
        }
      });
    } catch (error: any) {
      if (error?.name === 'ZodError') {
        return next(new AppError(`Validation error: ${error?.errors?.[0]?.message || 'Unknown validation error'}`, 400));
      }
      next(error);
    }
  }),

  // Get a single product by ID
  getProductById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await ProductService.getProductById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          product
        }
      });
    } catch (error: any) {
      next(error);
    }
  }),

  // Create a new product
  createProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = createProductSchema.parse(req.body);

      // Create product using service
      const newProduct = await ProductService.createProduct(validatedData as IProductInput, req.user?._id || 'system');

      res.status(201).json({
        status: 'success',
        data: {
          product: newProduct
        }
      });
    } catch (error: any) {
      if (error?.name === 'ZodError') {
        return next(new AppError(`Validation error: ${error?.errors?.[0]?.message || 'Unknown validation error'}`, 400));
      }
      next(error);
    }
  }),

  // Update a product
  updateProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = updateProductSchema.parse(req.body);

      // Update product using service
      const updatedProduct = await ProductService.updateProduct(
        req.params.id,
        validatedData as IProductUpdate,
        req.user?._id || 'system'
      );

      res.status(200).json({
        status: 'success',
        data: {
          product: updatedProduct
        }
      });
    } catch (error: any) {
      if (error?.name === 'ZodError') {
        return next(new AppError(`Validation error: ${error?.errors?.[0]?.message || 'Unknown validation error'}`, 400));
      }
      next(error);
    }
  }),

  // Delete a product (soft delete by setting isActive to false)
  deleteProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ProductService.deleteProduct(req.params.id, req.user?._id || 'system');

      res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error: any) {
      next(error);
    }
  }),

  // Get products by category
  getProductsByCategory: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await ProductService.getProductsByCategory(req.params.categoryId);

      res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
          products
        }
      });
    } catch (error: any) {
      next(error);
    }
  }),

  // Get products by supplier
  getProductsBySupplier: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await ProductService.getProductsBySupplier(req.params.supplierId);

      res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
          products
        }
      });
    } catch (error: any) {
      next(error);
    }
  })
};
