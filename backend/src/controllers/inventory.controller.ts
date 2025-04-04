import { Request, Response, NextFunction } from 'express';
import { InventoryItem } from '../models/inventory.model';
import { WebSocketService } from '../services/WebSocketService';
import { CacheService } from '../services/CacheService';

export class InventoryController {
  private wsService: WebSocketService;
  private cache: CacheService;

  constructor() {
    this.wsService = WebSocketService.getInstance();
    this.cache = CacheService.getInstance();
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cached = await this.cache.get('inventory:all');
      if (cached) {
        return res.json(cached);
      }

      const items = await InventoryItem.find();
      await this.cache.set('inventory:all', items, 300); // Cache for 5 minutes
      res.json(items);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = new InventoryItem(req.body);
      await item.save();
      
      this.wsService.broadcast('inventory:created', item);
      await this.cache.delete('inventory:all');
      
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  };

  // ...additional methods
}

export default new InventoryController();