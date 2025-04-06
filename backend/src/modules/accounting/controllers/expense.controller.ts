import { Request, Response } from 'express';
import { Expense } from '../models/expense.model';
import { StatusManagementService } from '../../../shared/services/statusManagement.service';
import { ApiError } from '../../../shared/utils/ApiError';
import { ApiResponse } from '../../../shared/utils/ApiResponse';

const statusManagementService = new StatusManagementService();

export class ExpenseController {
  // Get all expenses with optional filters
  async getExpenses(req: Request, res: Response) {
    try {
      const {
        departmentId,
        category,
        status,
        startDate,
        endDate,
        includeDeleted = false
      } = req.query;

      const query: any = {};

      if (!includeDeleted) {
        query.isDeleted = false;
      }

      if (departmentId) {
        query.departmentId = departmentId;
      }

      if (category) {
        query.category = category;
      }

      if (status) {
        query.status = status;
      }

      if (startDate || endDate) {
        query.date = {};
        if (startDate) {
          query.date.$gte = new Date(startDate as string);
        }
        if (endDate) {
          query.date.$lte = new Date(endDate as string);
        }
      }

      const expenses = await Expense.find(query)
        .populate('createdBy', 'firstName lastName email')
        .populate('departmentId', 'name')
        .populate('approvedBy', 'firstName lastName email')
        .populate('rejectedBy', 'firstName lastName email')
        .populate('cancelledBy', 'firstName lastName email')
        .populate('voidedBy', 'firstName lastName email')
        .populate('deletedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

      return res.json(new ApiResponse(200, 'Expenses retrieved successfully', expenses));
    } catch (error) {
      throw new ApiError(500, 'Failed to retrieve expenses');
    }
  }

  // Create a new expense
  async createExpense(req: Request, res: Response) {
    try {
      const expense = new Expense({
        ...req.body,
        createdBy: req.user._id
      });

      await expense.save();
      await expense.populate('createdBy', 'firstName lastName email');
      await expense.populate('departmentId', 'name');

      return res.status(201).json(new ApiResponse(201, 'Expense created successfully', expense));
    } catch (error) {
      throw new ApiError(500, 'Failed to create expense');
    }
  }

  // Update expense status
  async updateExpenseStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const userId = req.user._id;

      const expense = await Expense.findById(id);
      if (!expense) {
        throw new ApiError(404, 'Expense not found');
      }

      if (expense.isDeleted) {
        throw new ApiError(400, 'Cannot update deleted expense');
      }

      // Update status using status management service
      await statusManagementService.changeStatus(
        'expenses',
        id,
        status,
        `EXPENSE_${status.toUpperCase()}`,
        reason,
        userId
      );

      // Update expense status and related fields
      expense.status = status;
      expense.reason = reason;
      expense[`${status}By`] = userId;
      expense[`${status}At`] = new Date();

      await expense.save();
      await expense.populate(`${status}By`, 'firstName lastName email');

      return res.json(new ApiResponse(200, 'Expense status updated successfully', expense));
    } catch (error) {
      throw new ApiError(500, 'Failed to update expense status');
    }
  }

  // Soft delete an expense
  async softDeleteExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const expense = await Expense.findById(id);
      if (!expense) {
        throw new ApiError(404, 'Expense not found');
      }

      if (expense.isDeleted) {
        throw new ApiError(400, 'Expense is already deleted');
      }

      if (expense.status === 'approved') {
        throw new ApiError(400, 'Cannot delete approved expense');
      }

      await expense.softDelete(userId);
      await expense.populate('deletedBy', 'firstName lastName email');

      return res.json(new ApiResponse(200, 'Expense deleted successfully', expense));
    } catch (error) {
      throw new ApiError(500, 'Failed to delete expense');
    }
  }

  // Restore a soft deleted expense
  async restoreExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const expense = await Expense.findById(id);
      if (!expense) {
        throw new ApiError(404, 'Expense not found');
      }

      if (!expense.isDeleted) {
        throw new ApiError(400, 'Expense is not deleted');
      }

      await expense.restore();

      return res.json(new ApiResponse(200, 'Expense restored successfully', expense));
    } catch (error) {
      throw new ApiError(500, 'Failed to restore expense');
    }
  }

  // Get a single expense by ID
  async getExpenseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { includeDeleted = false } = req.query;

      const query: any = { _id: id };
      if (!includeDeleted) {
        query.isDeleted = false;
      }

      const expense = await Expense.findOne(query)
        .populate('createdBy', 'firstName lastName email')
        .populate('departmentId', 'name')
        .populate('approvedBy', 'firstName lastName email')
        .populate('rejectedBy', 'firstName lastName email')
        .populate('cancelledBy', 'firstName lastName email')
        .populate('voidedBy', 'firstName lastName email')
        .populate('deletedBy', 'firstName lastName email');

      if (!expense) {
        throw new ApiError(404, 'Expense not found');
      }

      return res.json(new ApiResponse(200, 'Expense retrieved successfully', expense));
    } catch (error) {
      throw new ApiError(500, 'Failed to retrieve expense');
    }
  }
} 