import { Router } from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  generateContract
} from '../controllers/contract.controller';

const router = Router();

router.get('/', getAllContracts);
router.get('/:id', getContractById);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

// Generate and export contract as PDF
router.post('/generate', generateContract);

export default router;