import { Request, Response, NextFunction } from 'express';
import { Inventory } from '../models/inventory.model';
import { AppError } from '../utils/appError';

export const inventoryController = {
  async getAllInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await Inventory.find();
      res.status(200).json({
        status: 'success',
        results: inventory.length,
        data: {
          inventory
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await Inventory.findById(req.params.id);
      if (!item) {
        return next(new AppError('No inventory item found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          item
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, quantity, unit, price } = req.body;

      const newItem = await Inventory.create({
        name,
        description,
        quantity,
        unit,
        price
      });

      res.status(201).json({
        status: 'success',
        data: {
          item: newItem
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, quantity, unit, price } = req.body;

      const item = await Inventory.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          quantity,
          unit,
          price
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!item) {
        return next(new AppError('No inventory item found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          item
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await Inventory.findByIdAndDelete(req.params.id);
      if (!item) {
        return next(new AppError('No inventory item found with that ID', 404));
      }
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}; 