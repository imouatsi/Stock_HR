import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { isAuthenticated } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Apply authentication middleware to all category routes
router.use(isAuthenticated);

// Get all categories
router.get(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'seller', 'auditor']),
  categoryController.getAllCategories
);

// Create a new category
router.post(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager']),
  categoryController.createCategory
);

// Get a single category by ID
router.get(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'seller', 'auditor']),
  categoryController.getCategoryById
);

// Update a category
router.patch(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager']),
  categoryController.updateCategory
);

// Delete a category
router.delete(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager']),
  categoryController.deleteCategory
);

// Get subcategories
router.get(
  '/:id/subcategories',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'seller', 'auditor']),
  categoryController.getSubcategories
);

// Get root categories
router.get(
  '/root/all',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'seller', 'auditor']),
  categoryController.getRootCategories
);

export default router;
