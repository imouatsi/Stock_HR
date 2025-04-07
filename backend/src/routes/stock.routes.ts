import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { isAuthenticated } from '../middleware/auth';
import { stockController } from '../controllers/stock.controller';
import { stockSchema } from '../schemas/stock.schema';

const router = Router();

// Apply authentication middleware to all stock routes
router.use(isAuthenticated);

// Get all stock items with optional filters
router.get('/', stockController.getAllStockItems);

// Get a single stock item by ID
router.get('/:id', stockController.getStockItem);

// Create a new stock item
router.post('/', validateRequest(stockSchema), stockController.createStockItem);

// Update a stock item
router.put('/:id', validateRequest(stockSchema), stockController.updateStockItem);

// Delete a stock item
router.delete('/:id', stockController.deleteStockItem);

// Get all categories
router.get('/categories/list', stockController.getCategories);

// Get all suppliers
router.get('/suppliers/list', stockController.getSuppliers);

export default router; 