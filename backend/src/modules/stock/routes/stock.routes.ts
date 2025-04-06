import { Router } from 'express';
import { protect, restrictTo } from '../../shared/middleware/auth.middleware';
import * as stockCategoryController from '../controllers/stockCategory.controller';
import * as supplierController from '../controllers/supplier.controller';
import * as stockMovementController from '../controllers/stockMovement.controller';
import * as purchaseOrderController from '../controllers/purchaseOrder.controller';
import * as inventoryController from '../controllers/inventory.controller';
import { validateRequest } from '../../../middleware/validateRequest';
import { stockMovementSchema } from '../validators/stockMovement.validator';
import { purchaseOrderSchema } from '../validators/purchaseOrder.validator';
import { inventoryItemSchema } from '../validators/inventoryItem.validator';
import { supplierSchema } from '../validators/supplier.validator';
import { stockCategorySchema } from '../validators/stockCategory.validator';
import { stockAccessTokenSchema } from '../schemas/stockAccessToken.schema';
import {
  requestAccessToken,
  releaseAccessToken,
  cancelAccessToken,
  getActiveAccessToken
} from '../controllers/stockAccessToken.controller';
import { purchaseOrderAccessTokenSchema } from '../schemas/purchaseOrderAccessToken.schema';
import {
  requestAccessToken as requestPurchaseOrderAccessToken,
  releaseAccessToken as releasePurchaseOrderAccessToken,
  cancelAccessToken as cancelPurchaseOrderAccessToken,
  getActiveAccessToken as getActivePurchaseOrderAccessToken
} from '../controllers/purchaseOrderAccessToken.controller';

const router = Router();

// Protect all routes
router.use(protect);

// Stock Category routes
router
  .route('/categories')
  .get(stockCategoryController.getAllCategories)
  .post(
    restrictTo('admin', 'stock_manager'),
    validateRequest(stockCategorySchema),
    stockCategoryController.createCategory
  );

router
  .route('/categories/:id')
  .get(stockCategoryController.getCategory)
  .patch(
    restrictTo('admin', 'stock_manager'),
    validateRequest(stockCategorySchema),
    stockCategoryController.updateCategory
  )
  .delete(
    restrictTo('admin', 'stock_manager'),
    stockCategoryController.deleteCategory
  );

// Supplier routes
router
  .route('/suppliers')
  .get(supplierController.getAllSuppliers)
  .post(
    restrictTo('admin', 'stock_manager'),
    validateRequest(supplierSchema),
    supplierController.createSupplier
  );

router
  .route('/suppliers/:id')
  .get(supplierController.getSupplier)
  .patch(
    restrictTo('admin', 'stock_manager'),
    validateRequest(supplierSchema),
    supplierController.updateSupplier
  )
  .delete(
    restrictTo('admin', 'stock_manager'),
    supplierController.deleteSupplier
  );

router
  .route('/suppliers/:id/toggle-status')
  .patch(
    restrictTo('admin', 'stock_manager'),
    supplierController.toggleSupplierStatus
  );

// Stock Movement routes
router
  .route('/movements')
  .get(stockMovementController.getAllMovements)
  .post(
    restrictTo('admin', 'stock_manager'),
    validateRequest(stockMovementSchema),
    stockMovementController.createMovement
  );

router
  .route('/movements/:id')
  .get(stockMovementController.getMovement)
  .patch(
    restrictTo('admin', 'stock_manager'),
    validateRequest(stockMovementSchema),
    stockMovementController.updateMovement
  )
  .delete(
    restrictTo('admin'),
    stockMovementController.deleteMovement
  );

router
  .route('/movements/:id/cancel')
  .post(
    restrictTo('admin', 'stock_manager'),
    stockMovementController.cancelMovement
  );

// Purchase Order routes
router
  .route('/purchase-orders')
  .get(purchaseOrderController.getAllPurchaseOrders)
  .post(
    restrictTo('admin', 'stock_manager'),
    validateRequest(purchaseOrderSchema),
    purchaseOrderController.createPurchaseOrder
  );

router
  .route('/purchase-orders/:id')
  .get(purchaseOrderController.getPurchaseOrder)
  .patch(
    restrictTo('admin', 'stock_manager'),
    validateRequest(purchaseOrderSchema),
    purchaseOrderController.updatePurchaseOrder
  )
  .delete(
    restrictTo('admin', 'stock_manager'),
    purchaseOrderController.deletePurchaseOrder
  );

router
  .route('/purchase-orders/:id/status')
  .patch(
    restrictTo('admin', 'stock_manager'),
    purchaseOrderController.updatePurchaseOrderStatus
  );

// Inventory routes
router
  .route('/inventory')
  .get(inventoryController.getAllInventoryItems)
  .post(
    restrictTo('admin', 'stock_manager'),
    validateRequest(inventoryItemSchema),
    inventoryController.createInventoryItem
  );

router
  .route('/inventory/:id')
  .get(inventoryController.getInventoryItem)
  .patch(
    restrictTo('admin', 'stock_manager'),
    validateRequest(inventoryItemSchema),
    inventoryController.updateInventoryItem
  )
  .delete(
    restrictTo('admin', 'stock_manager'),
    inventoryController.deleteInventoryItem
  );

// Stock access token routes
router.post(
  '/access-token',
  protect,
  restrictTo('admin', 'stock_manager', 'sales_clerk'),
  validateRequest(stockAccessTokenSchema),
  requestAccessToken
);

router.post(
  '/access-token/:token/release',
  protect,
  releaseAccessToken
);

router.post(
  '/access-token/:token/cancel',
  protect,
  cancelAccessToken
);

router.get(
  '/access-token/:inventoryItem',
  protect,
  getActiveAccessToken
);

// Purchase order access token routes
router.post(
  '/purchase-orders/access-token',
  protect,
  validateRequest(purchaseOrderAccessTokenSchema),
  requestPurchaseOrderAccessToken
);

router.post(
  '/purchase-orders/access-token/:token/release',
  protect,
  releasePurchaseOrderAccessToken
);

router.post(
  '/purchase-orders/access-token/:token/cancel',
  protect,
  cancelPurchaseOrderAccessToken
);

router.get(
  '/purchase-orders/access-token/:purchaseOrder',
  protect,
  getActivePurchaseOrderAccessToken
);

export default router; 