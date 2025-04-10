import { Product } from '../models/product.model';
import { IProductInput, IProductUpdate, IProductFilters } from '../interfaces/product.interface';
import { AppError } from '../utils/appError';

export class ProductService {
  static async getAllProducts(filters: IProductFilters = {}) {
    const {
      search,
      category,
      supplier,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = filters;

    // Build query
    const query: any = {};

    // Apply filters
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (supplier) {
      query.supplier = supplier;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Count total documents for pagination
    const totalDocs = await Product.countDocuments(query);

    // Apply pagination
    const skip = (page - 1) * limit;

    // Apply sorting
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name code')
      .populate('supplier', 'name code');

    return {
      products,
      pagination: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        limit
      }
    };
  }

  static async getProductById(id: string) {
    const product = await Product.findById(id)
      .populate('category', 'name code')
      .populate('supplier', 'name code');

    if (!product) {
      throw new AppError('No product found with that ID', 404);
    }

    return product;
  }

  static async createProduct(productData: IProductInput, userId: string) {
    // Check if barcode is provided and unique
    if (productData.barcode) {
      const existingProduct = await Product.findOne({ barcode: productData.barcode });
      if (existingProduct) {
        throw new AppError('A product with this barcode already exists', 400);
      }
    }

    const newProduct = await Product.create({
      ...productData,
      createdBy: userId,
      updatedBy: userId
    });

    return newProduct;
  }

  static async updateProduct(id: string, productData: IProductUpdate, userId: string) {
    // Check if barcode is being updated and is unique
    if (productData.barcode) {
      const existingProduct = await Product.findOne({
        barcode: productData.barcode,
        _id: { $ne: id }
      });
      if (existingProduct) {
        throw new AppError('A product with this barcode already exists', 400);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...productData,
        updatedBy: userId
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('category', 'name code')
      .populate('supplier', 'name code');

    if (!updatedProduct) {
      throw new AppError('No product found with that ID', 404);
    }

    return updatedProduct;
  }

  static async deleteProduct(id: string, userId: string) {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        isActive: false,
        updatedBy: userId
      },
      {
        new: true
      }
    );

    if (!product) {
      throw new AppError('No product found with that ID', 404);
    }

    return product;
  }

  static async getProductsByCategory(categoryId: string) {
    const products = await Product.find({
      category: categoryId,
      isActive: true
    }).populate('category', 'name code')
      .populate('supplier', 'name code');

    return products;
  }

  static async getProductsBySupplier(supplierId: string) {
    const products = await Product.find({
      supplier: supplierId,
      isActive: true
    }).populate('category', 'name code')
      .populate('supplier', 'name code');

    return products;
  }
}
