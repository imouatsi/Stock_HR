import { Request, Response, NextFunction } from 'express';
import { InventoryItem } from '../models/inventory.model';
import { WebSocketService } from '../services/WebSocketService';

export class InventoryController {
  private wsService: WebSocketService;

  constructor(server: any) {
    this.wsService = WebSocketService.getInstance(server);
  }

  public getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await InventoryItem.find();
      res.status(200).json({ status: 'success', data: { items } });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await InventoryItem.create(req.body);
      this.wsService.broadcast('inventory:created', item);
      res.status(201).json({ status: 'success', data: { item } });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) {
        return res.status(404).json({ status: 'fail', message: 'Item not found' });
      }
      this.wsService.broadcast('inventory:updated', item);
      return res.status(200).json({ status: 'success', data: { item } });
    } catch (error) {
      next(error);
      return; // Ensure all code paths return
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await InventoryItem.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ status: 'fail', message: 'Item not found' });
      }
      this.wsService.broadcast('inventory:deleted', { id: req.params.id });
      return res.status(204).json({ status: 'success', data: null });
    } catch (error) {
      next(error);
      return; // Ensure all code paths return
    }
  };
}

export const getAllItems = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await InventoryItem.find();
    res.status(200).json({ status: 'success', data: { items } });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Item not found' });
    }
    return res.status(200).json({ status: 'success', data: { item } });
  } catch (error) {
    next(error);
    return;
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Item not found' });
    }
    return res.status(200).json({ status: 'success', data: { item } });
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Item not found' });
    }
    return res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
    return;
  }
};

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json({ status: 'success', data: { item } });
  } catch (error) {
    next(error);
  }
};

// Provide the required server argument when creating an instance
export default (server: any) => new InventoryController(server);