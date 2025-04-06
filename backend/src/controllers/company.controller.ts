import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { Company } from '../models/company.model';
import { catchAsync } from '../utils/catchAsync';

export const companyController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await Company.find();
      res.json(companies);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        throw AppError.notFound('Company not found');
      }
      res.json(company);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await Company.create(req.body);
      res.status(201).json(company);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!company) {
        throw AppError.notFound('Company not found');
      }
      res.json(company);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await Company.findByIdAndDelete(req.params.id);
      if (!company) {
        throw AppError.notFound('Company not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Get company details
  getCompanyDetails: catchAsync(async (_req: Request, res: Response) => {
    const company = await Company.findOne();
    if (!company) {
      throw new AppError(404, 'Company details not found');
    }
    res.json(company);
  }),

  // Update company details
  updateCompanyDetails: catchAsync(async (req: Request, res: Response) => {
    const company = await Company.findOne();
    if (!company) {
      throw new AppError(404, 'Company details not found');
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedCompany);
  }),

  // Upload company logo
  uploadLogo: catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(400, 'No file uploaded');
    }

    const company = await Company.findOne();
    if (!company) {
      throw new AppError(404, 'Company details not found');
    }

    // Update logo path
    const logoPath = `/uploads/logos/${req.file.filename}`;
    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      { $set: { logo: logoPath } },
      { new: true, runValidators: true }
    );

    res.json(updatedCompany);
  }),
}; 