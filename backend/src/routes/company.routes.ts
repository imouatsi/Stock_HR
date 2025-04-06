import { Router } from 'express';
import { companyController } from '../controllers/company.controller';
import { validate } from '../middleware/validation.middleware';
import { companySchema } from '../schemas/company.schema';
import { role } from '../middleware/auth.middleware';

const router = Router();

router
  .route('/')
  .get(companyController.getAll)
  .post(role('admin'), validate(companySchema), companyController.create);

router
  .route('/:id')
  .get(companyController.getById)
  .put(role('admin'), validate(companySchema), companyController.update)
  .delete(role('admin'), companyController.delete);

export default router; 