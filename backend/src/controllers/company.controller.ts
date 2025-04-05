import { Request, Response } from 'express';
import { Company } from '../models/company.model';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export class CompanyController {
  // Get company details
  static getCompanyDetails = catchAsync(async (_req: Request, res: Response) => {
    const company = await Company.findOne();
    if (!company) {
      throw new AppError(404, 'Company details not found');
    }
    res.json(company);
  });

  // Update company details
  static updateCompanyDetails = catchAsync(async (req: Request, res: Response) => {
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
  });

  // Upload company logo
  static uploadLogo = catchAsync(async (req: Request, res: Response) => {
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
  });
} 