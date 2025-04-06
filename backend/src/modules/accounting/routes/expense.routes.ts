import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import { validateRequest } from '../../../shared/middleware/validateRequest';
import { expenseSchema } from '../schemas/expense.schema';

const router = Router();
const expenseController = new ExpenseController();

// Get all expenses
router.get(
  '/',
  authenticate,
  authorize(['accounting:view']),
  expenseController.getExpenses
);

// Get a single expense
router.get(
  '/:id',
  authenticate,
  authorize(['accounting:view']),
  expenseController.getExpenseById
);

// Create a new expense
router.post(
  '/',
  authenticate,
  authorize(['accounting:create']),
  validateRequest(expenseSchema),
  expenseController.createExpense
);

// Update expense status
router.patch(
  '/:id/status',
  authenticate,
  authorize(['accounting:update']),
  expenseController.updateExpenseStatus
);

// Soft delete an expense
router.patch(
  '/:id/soft-delete',
  authenticate,
  authorize(['accounting:delete']),
  expenseController.softDeleteExpense
);

// Restore a soft deleted expense
router.patch(
  '/:id/restore',
  authenticate,
  authorize(['accounting:restore']),
  expenseController.restoreExpense
);

export default router; 