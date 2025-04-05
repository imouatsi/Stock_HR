import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest.middleware';
import { companySchema } from '../validators/company.validator';
import { upload } from '../utils/upload';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get company details
router.get('/', CompanyController.getCompanyDetails);

// Update company details
router.put(
  '/',
  validateRequest(companySchema),
  CompanyController.updateCompanyDetails
);

// Upload company logo
router.post('/logo', upload.single('logo') as any, CompanyController.uploadLogo);

export default router; 