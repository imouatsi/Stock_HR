import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/category.model';
import { ICategoryInput, ICategoryUpdate, ICategoryFilters } from '../interfaces/category.interface';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const categoryController = {
  // Get all categories with filtering, sorting, and pagination
  getAllCategories: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      search,
      parent,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query as unknown as ICategoryFilters;

    // Build query
    const query: any = {};

    // Apply filters
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    if (parent) {
      query.parent = parent;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Count total documents for pagination
    const totalDocs = await Category.countDocuments(query);

    // Apply pagination
    const skip = (page - 1) * limit;

    // Apply sorting
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const categories = await Category.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('parent', 'name code');

    res.status(200).json({
      status: 'success',
      results: categories.length,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
      data: {
        categories
      }
    });
  }),

  // Get a single category by ID
  getCategoryById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name code');

    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  }),

  // Create a new category
  createCategory: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryData: ICategoryInput = req.body;

    // Check if code is provided and unique
    if (categoryData.code) {
      const existingCategory = await Category.findOne({ code: categoryData.code });
      if (existingCategory) {
        return next(new AppError('A category with this code already exists', 400));
      }
    }

    // Check if parent exists
    if (categoryData.parent) {
      const parentCategory = await Category.findById(categoryData.parent);
      if (!parentCategory) {
        return next(new AppError('Parent category not found', 404));
      }
    }

    const newCategory = await Category.create({
      ...categoryData,
      createdBy: req.user?._id || 'system',
      updatedBy: req.user?._id || 'system'
    });

    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory
      }
    });
  }),

  // Update a category
  updateCategory: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryData: ICategoryUpdate = {
      ...req.body,
      updatedBy: req.user?._id || 'system'
    };

    // Check if code is being updated and is unique
    if (categoryData.code) {
      const existingCategory = await Category.findOne({
        code: categoryData.code,
        _id: { $ne: req.params.id }
      });
      if (existingCategory) {
        return next(new AppError('A category with this code already exists', 400));
      }
    }

    // Check if parent exists and is not the category itself
    if (categoryData.parent) {
      if (categoryData.parent === req.params.id) {
        return next(new AppError('A category cannot be its own parent', 400));
      }

      const parentCategory = await Category.findById(categoryData.parent);
      if (!parentCategory) {
        return next(new AppError('Parent category not found', 404));
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      {
        new: true,
        runValidators: true
      }
    ).populate('parent', 'name code');

    if (!updatedCategory) {
      return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        category: updatedCategory
      }
    });
  }),

  // Delete a category (soft delete by setting isActive to false)
  deleteCategory: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Check if category has children
    const hasChildren = await Category.exists({ parent: req.params.id, isActive: true });
    if (hasChildren) {
      return next(new AppError('Cannot delete a category that has active subcategories', 400));
    }

    // Check if category has products
    // This would require a Product model check
    // const hasProducts = await Product.exists({ category: req.params.id, isActive: true });
    // if (hasProducts) {
    //   return next(new AppError('Cannot delete a category that has active products', 400));
    // }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        updatedBy: req.user?._id || 'system'
      },
      {
        new: true
      }
    );

    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  }),

  // Get subcategories
  getSubcategories: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const subcategories = await Category.find({
      parent: req.params.id,
      isActive: true
    }).populate('parent', 'name code');

    res.status(200).json({
      status: 'success',
      results: subcategories.length,
      data: {
        categories: subcategories
      }
    });
  }),

  // Get root categories (categories without a parent)
  getRootCategories: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rootCategories = await Category.find({
      parent: { $exists: false },
      isActive: true
    });

    res.status(200).json({
      status: 'success',
      results: rootCategories.length,
      data: {
        categories: rootCategories
      }
    });
  })
};
