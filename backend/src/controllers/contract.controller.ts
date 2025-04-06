import { Request, Response, NextFunction } from 'express';
import { Contract } from '../models/contract.model';
import { AppError } from '../utils/appError';

export const contractController = {
  async getAllContracts(req: Request, res: Response, next: NextFunction) {
    try {
      const contracts = await Contract.find();
      res.json({
        success: true,
        count: contracts.length,
        data: contracts
      });
    } catch (error) {
      next(error);
    }
  },

  async getContract(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return next(new AppError('Contract not found', 404));
      }
      res.json({
        success: true,
        data: contract
      });
    } catch (error) {
      next(error);
    }
  },

  async createContract(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await Contract.create(req.body);
      res.status(201).json({
        success: true,
        data: contract
      });
    } catch (error) {
      next(error);
    }
  },

  async updateContract(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await Contract.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
      if (!contract) {
        return next(new AppError('Contract not found', 404));
      }
      res.json({
        success: true,
        data: contract
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteContract(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await Contract.findByIdAndDelete(req.params.id);
      if (!contract) {
        return next(new AppError('Contract not found', 404));
      }
      res.json({
        success: true,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  },

  async generateContract(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return next(new AppError('Contract not found', 404));
      }

      // TODO: Implement contract generation logic
      res.json({
        success: true,
        message: 'Contract generated successfully',
        data: contract
      });
    } catch (error) {
      next(error);
    }
  }
}; 