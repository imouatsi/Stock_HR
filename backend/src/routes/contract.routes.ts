import { Router } from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract
} from '../controllers/contract.controller';

const router = Router();

router.get('/', getAllContracts);
router.get('/:id', getContractById);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

export default router; 