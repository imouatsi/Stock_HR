import express from 'express';
import {
  getAllProformas,
  getProformaById,
  createProforma,
  updateProforma,
  deleteProforma,
  finalizeProforma,
  generatePDF
} from '../controllers/proforma.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(protect, getAllProformas)
  .post(protect, createProforma);

router
  .route('/:id')
  .get(protect, getProformaById)
  .patch(protect, updateProforma)
  .delete(protect, deleteProforma);

router
  .route('/:id/finalize')
  .post(protect, finalizeProforma);

router
  .route('/:id/pdf')
  .get(protect, generatePDF);

export default router; 