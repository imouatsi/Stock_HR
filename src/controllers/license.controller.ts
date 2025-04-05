import { Request, Response, NextFunction } from 'express';
import License from '../models/license.model';

export const updateLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedLicense = await License.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedLicense) {
      return res.status(404).json({ message: 'License not found' });
    }
    return res.status(200).json(updatedLicense);
  } catch (error) {
    next(error);
  }
};

export const deleteLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedLicense = await License.findByIdAndDelete(id);
    if (!deletedLicense) {
      return res.status(404).json({ message: 'License not found' });
    }
    return res.status(200).json({ message: 'License deleted successfully' });
  } catch (error) {
    next(error);
  }
}; 