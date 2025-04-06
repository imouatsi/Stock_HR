import { Request, Response, NextFunction } from 'express';
import { Company } from '../models/company.model';
import { AppError } from '../utils/appError';

export const companyController = {
  async getAllCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await Company.find();
      res.status(200).json({
        status: 'success',
        results: companies.length,
        data: {
          companies
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        return next(new AppError('No company found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          company
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, address, phone, email, taxNumber } = req.body;

      // Check if company already exists
      const existingCompany = await Company.findOne({ name });
      if (existingCompany) {
        return next(new AppError('Company with this name already exists', 400));
      }

      const newCompany = await Company.create({
        name,
        address,
        phone,
        email,
        taxNumber
      });

      res.status(201).json({
        status: 'success',
        data: {
          company: newCompany
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, address, phone, email, taxNumber } = req.body;

      const company = await Company.findByIdAndUpdate(
        req.params.id,
        {
          name,
          address,
          phone,
          email,
          taxNumber
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!company) {
        return next(new AppError('No company found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          company
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await Company.findByIdAndDelete(req.params.id);
      if (!company) {
        return next(new AppError('No company found with that ID', 404));
      }
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}; 