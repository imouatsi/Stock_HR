import express from 'express';
import { licenseController } from '../controllers/license.controller';
import { licenseValidation } from '../validation/license.validation';
import { validateRequest } from '../middleware/validate.middleware';
import { protect, restrictTo } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(licenseController.getAllLicenses)
  .post(validateRequest(licenseValidation.createLicense), licenseController.createLicense);

router
  .route('/:id')
  .get(licenseController.getLicense)
  .patch(validateRequest(licenseValidation.updateLicense), licenseController.updateLicense)
  .delete(licenseController.deleteLicense);

router.post('/:id/generate', licenseController.generateLicense);

export default router; 