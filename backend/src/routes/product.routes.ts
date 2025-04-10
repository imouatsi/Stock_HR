import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { isAuthenticated } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Apply authentication middleware to all product routes
router.use(isAuthenticated);

// Get all products
router.get(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'seller', 'auditor']),
  productController.getAllProducts
);

// Create a new product
router.post(
  '/',
  authorize(['admin', 'superadmin', 'stock_manager']),
  productController.createProduct
);

// Get a single product by ID
router.get(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'seller', 'auditor']),
  productController.getProductById
);

// Update a product
router.patch(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager']),
  productController.updateProduct
);

// Delete a product
router.delete(
  '/:id',
  authorize(['admin', 'superadmin', 'stock_manager']),
  productController.deleteProduct
);

// Get products by category
router.get(
  '/category/:categoryId',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'seller', 'auditor']),
  productController.getProductsByCategory
);

// Get products by supplier
router.get(
  '/supplier/:supplierId',
  authorize(['admin', 'superadmin', 'stock_manager', 'stock_clerk', 'seller', 'auditor']),
  productController.getProductsBySupplier
);

export default router;
