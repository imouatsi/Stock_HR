import { Request, Response, NextFunction } from 'express';
import { License } from '../models/license.model';
import { AppError } from '../utils/appError';

export const licenseController = {
  async getAllLicenses(req: Request, res: Response, next: NextFunction) {
    try {
      const licenses = await License.find();
      res.status(200).json({
        status: 'success',
        results: licenses.length,
        data: {
          licenses
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getLicense(req: Request, res: Response, next: NextFunction) {
    try {
      const license = await License.findById(req.params.id);
      if (!license) {
        return next(new AppError('No license found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          license
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createLicense(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, startDate, endDate, status, company } = req.body;

      const newLicense = await License.create({
        name,
        description,
        startDate,
        endDate,
        status,
        company
      });

      res.status(201).json({
        status: 'success',
        data: {
          license: newLicense
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateLicense(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, startDate, endDate, status, company } = req.body;

      const license = await License.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          startDate,
          endDate,
          status,
          company
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!license) {
        return next(new AppError('No license found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          license
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteLicense(req: Request, res: Response, next: NextFunction) {
    try {
      const license = await License.findByIdAndDelete(req.params.id);
      if (!license) {
        return next(new AppError('No license found with that ID', 404));
      }
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  },

  async generateLicense(req: Request, res: Response, next: NextFunction) {
    try {
      const license = await License.findById(req.params.id);
      if (!license) {
        return next(new AppError('No license found with that ID', 404));
      }

      // TODO: Implement license generation logic
      res.status(200).json({
        status: 'success',
        message: 'License generated successfully',
        data: {
          license
        }
      });
    } catch (error) {
      next(error);
    }
  }
}; 