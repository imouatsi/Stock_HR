import { Router, RequestHandler } from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  generateContract
} from '../controllers/contract.controller';

const router = Router();

router.get('/', getAllContracts as RequestHandler);
router.get('/:id', getContractById as RequestHandler);
router.post('/', createContract as RequestHandler);
router.put('/:id', updateContract as RequestHandler);
router.delete('/:id', deleteContract as RequestHandler);

// Generate and export contract as PDF
router.post('/generate', generateContract as RequestHandler);

export default router;