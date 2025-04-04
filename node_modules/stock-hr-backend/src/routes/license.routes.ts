import { Router } from 'express';
import {
  getAllLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense
} from '../controllers/license.controller';

const router = Router();

router.get('/', getAllLicenses);
router.get('/:id', getLicenseById);
router.post('/', createLicense);
router.put('/:id', updateLicense);
router.delete('/:id', deleteLicense);

export default router; 