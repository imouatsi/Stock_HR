import express from 'express';
import { companyController } from '../controllers/company.controller';
import { companyValidation } from '../validation/company.validation';
import { validateRequest } from '../middleware/validate.middleware';
import { protect, restrictTo } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(companyController.getAllCompanies)
  .post(validateRequest(companyValidation.createCompany), companyController.createCompany);

router
  .route('/:id')
  .get(companyController.getCompany)
  .patch(validateRequest(companyValidation.updateCompany), companyController.updateCompany)
  .delete(companyController.deleteCompany);

export default router; 