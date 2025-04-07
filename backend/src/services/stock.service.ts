import { StockItem } from '../models/stock.model';
import { AppError } from '../utils/AppError';
import { IStockItem, IStockItemInput, IStockItemUpdate } from '../interfaces/stock.interface';

export class StockService {
  static async getAllStockItems(
    search?: string,
    category?: string,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<IStockItem[]> {
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    return StockItem.find(query).sort(sortOptions);
  }

  static async getStockItemById(id: string): Promise<IStockItem> {
    const stockItem = await StockItem.findById(id);
    if (!stockItem) {
      throw new AppError('Stock item not found', 404);
    }
    return stockItem;
  }

  static async createStockItem(data: IStockItemInput, userId: string): Promise<IStockItem> {
    const stockItem = new StockItem({
      ...data,
      createdBy: userId,
      updatedBy: userId,
      lastRestocked: new Date()
    });
    return stockItem.save();
  }

  static async updateStockItem(
    id: string,
    data: IStockItemUpdate,
    userId: string
  ): Promise<IStockItem> {
    const stockItem = await StockItem.findById(id);
    if (!stockItem) {
      throw new AppError('Stock item not found', 404);
    }

    // Update lastRestocked if quantity changes
    if (data.quantity !== undefined && data.quantity !== stockItem.quantity) {
      data.lastRestocked = new Date();
    }

    Object.assign(stockItem, {
      ...data,
      updatedBy: userId
    });

    return stockItem.save();
  }

  static async deleteStockItem(id: string): Promise<void> {
    const stockItem = await StockItem.findById(id);
    if (!stockItem) {
      throw new AppError('Stock item not found', 404);
    }
    await stockItem.deleteOne();
  }

  static async getCategories(): Promise<string[]> {
    return StockItem.distinct('category');
  }

  static async getSuppliers(): Promise<string[]> {
    return StockItem.distinct('supplier');
  }
} 