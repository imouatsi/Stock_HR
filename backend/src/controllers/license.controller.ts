import { Request, Response, NextFunction } from 'express';
import License from '../models/license.model'; // Assuming a License model exists

export const getAllLicenses = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const licenses = await License.find();
    return res.status(200).json({
      status: 'success',
      data: {
        licenses
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getLicenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const license = await License.findById(req.params.id);
    if (!license) {
      return res.status(404).json({
        status: 'fail',
        message: 'License not found'
      });
    }
    return res.status(200).json({
      status: 'success',
      data: {
        license
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const createLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const license = await License.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: { license },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const license = await License.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!license) {
      return res.status(404).json({ status: 'fail', message: 'License not found' });
    }
    return res.status(200).json({
      status: 'success',
      data: { license },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const license = await License.findByIdAndDelete(req.params.id);
    if (!license) {
      return res.status(404).json({ status: 'fail', message: 'License not found' });
    }
    return res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    return next(error);
  }
};