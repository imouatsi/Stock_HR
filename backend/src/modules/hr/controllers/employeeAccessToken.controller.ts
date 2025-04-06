import { Request, Response, NextFunction } from 'express';
import { EmployeeAccessToken } from '../models/employeeAccessToken.model';
import { Employee } from '../models/employee.model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';

// Request access token
export const requestAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { employee, operation, details } = req.body;

  // Check if employee exists
  const employeeDoc = await Employee.findById(employee);
  if (!employeeDoc) {
    return next(new AppError('Employee not found', 404));
  }

  // Validate operation based on current status
  if (operation === 'status_change') {
    if (!details.newStatus) {
      return next(new AppError('New status is required for status change operation', 400));
    }
    
    // Validate status transition
    if (['terminated', 'retired', 'deceased'].includes(details.newStatus) && !details.reason) {
      return next(new AppError('Reason is required for this status change', 400));
    }
  }

  if (operation === 'asset_assignment' && !details.assetId) {
    return next(new AppError('Asset ID is required for asset assignment operation', 400));
  }

  if (operation === 'leave_approval' && !details.leaveRequestId) {
    return next(new AppError('Leave request ID is required for leave approval operation', 400));
  }

  // Check for existing active tokens
  const existingToken = await EmployeeAccessToken.findOne({
    employee,
    status: 'active'
  });

  if (existingToken) {
    return next(new AppError('Another user is currently accessing this employee', 409));
  }

  // Create new access token
  const token = await EmployeeAccessToken.create({
    employee,
    user: req.user._id,
    operation,
    details,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
  });

  res.status(201).json({
    status: 'success',
    data: {
      token: {
        token: token.token,
        expiresAt: token.expiresAt,
        operation: token.operation,
        details: token.details
      }
    }
  });
});

// Release access token
export const releaseAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  const accessToken = await EmployeeAccessToken.findOne({ token });
  if (!accessToken) {
    return next(new AppError('Access token not found', 404));
  }

  if (accessToken.user.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to release this token', 403));
  }

  accessToken.status = 'completed';
  await accessToken.save();

  res.status(200).json({
    status: 'success',
    data: null
  });
});

// Cancel access token
export const cancelAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  const accessToken = await EmployeeAccessToken.findOne({ token });
  if (!accessToken) {
    return next(new AppError('Access token not found', 404));
  }

  if (accessToken.user.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to cancel this token', 403));
  }

  accessToken.status = 'cancelled';
  await accessToken.save();

  res.status(200).json({
    status: 'success',
    data: null
  });
});

// Get active access token for an employee
export const getActiveAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { employee } = req.params;

  const accessToken = await EmployeeAccessToken.findOne({
    employee,
    status: 'active'
  });

  if (!accessToken) {
    return next(new AppError('No active access token found for this employee', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      token: {
        token: accessToken.token,
        expiresAt: accessToken.expiresAt,
        operation: accessToken.operation,
        details: accessToken.details
      }
    }
  });
}); 