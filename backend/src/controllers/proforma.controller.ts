import { Request, Response, NextFunction } from 'express';
import { jsPDF } from 'jspdf';
import Proforma from '../models/proforma.model';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/authRequest';

export const getAllProformas = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const proformas = await Proforma.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: proformas.length,
      data: {
        proformas
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProformaById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const proforma = await Proforma.findById(req.params.id);
    
    if (!proforma) {
      return next(new AppError('Proforma invoice not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        proforma
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createProforma = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Generate proforma number (PF-YYYY-XXX)
    const year = new Date().getFullYear();
    const count = await Proforma.countDocuments({
      invoiceNumber: new RegExp(`^PF-${year}-`)
    });
    const invoiceNumber = `PF-${year}-${String(count + 1).padStart(3, '0')}`;

    const proforma = await Proforma.create({
      ...req.body,
      invoiceNumber,
      createdBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        proforma
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProforma = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const proforma = await Proforma.findById(req.params.id);

    if (!proforma) {
      return next(new AppError('Proforma invoice not found', 404));
    }

    if (proforma.status === 'finalized') {
      return next(new AppError('Cannot edit a finalized proforma invoice', 400));
    }

    const updatedProforma = await Proforma.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        proforma: updatedProforma
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProforma = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const proforma = await Proforma.findById(req.params.id);

    if (!proforma) {
      return next(new AppError('Proforma invoice not found', 404));
    }

    if (proforma.status === 'finalized') {
      return next(new AppError('Cannot delete a finalized proforma invoice', 400));
    }

    await proforma.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

export const finalizeProforma = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const proforma = await Proforma.findById(req.params.id);

    if (!proforma) {
      return next(new AppError('Proforma invoice not found', 404));
    }

    if (proforma.status === 'finalized') {
      return next(new AppError('Proforma invoice is already finalized', 400));
    }

    proforma.status = 'finalized';
    await proforma.save();

    res.status(200).json({
      status: 'success',
      data: {
        proforma
      }
    });
  } catch (error) {
    next(error);
  }
};

export const generatePDF = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const proforma = await Proforma.findById(req.params.id);
    
    if (!proforma) {
      return next(new AppError('Proforma invoice not found', 404));
    }

    // Create PDF
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('PROFORMA INVOICE', 105, 20, { align: 'center' });
    
    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${proforma.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${proforma.date.toLocaleDateString()}`, 20, 50);
    
    // Add seller details
    doc.text('Seller Details:', 20, 70);
    doc.text(`Name: ${proforma.seller.name}`, 20, 80);
    doc.text(`Address: ${proforma.seller.address}`, 20, 90);
    doc.text(`NIF: ${proforma.seller.nif}`, 20, 100);
    doc.text(`RC: ${proforma.seller.rc}`, 20, 110);
    doc.text(`AI: ${proforma.seller.ai}`, 20, 120);
    doc.text(`IBAN: ${proforma.seller.iban}`, 20, 130);
    doc.text(`Bank: ${proforma.seller.bank}`, 20, 140);
    
    // Add buyer details
    doc.text('Buyer Details:', 20, 160);
    doc.text(`Name: ${proforma.buyer.name}`, 20, 170);
    doc.text(`Address: ${proforma.buyer.address}`, 20, 180);
    if (proforma.buyer.companyId) {
      doc.text(`Company ID: ${proforma.buyer.companyId}`, 20, 190);
    }
    
    // Add items table
    doc.text('Items:', 20, 210);
    let y = 220;
    proforma.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.description}`, 20, y);
      doc.text(`Qty: ${item.quantity}`, 100, y);
      doc.text(`Price: ${item.unitPrice} DZD`, 130, y);
      doc.text(`Total: ${item.total} DZD`, 170, y);
      y += 10;
    });
    
    // Add totals
    y += 10;
    doc.text(`Subtotal: ${proforma.subtotal} DZD`, 130, y);
    y += 10;
    doc.text(`VAT: ${proforma.vat} DZD`, 130, y);
    y += 10;
    doc.text(`Total Amount: ${proforma.totalAmount} DZD`, 130, y);
    
    // Add signature space
    y += 30;
    doc.text('Signature & Stamp:', 20, y);
    doc.line(20, y + 5, 80, y + 5);
    
    // Send PDF
    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=proforma-${proforma.invoiceNumber}.pdf`);
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    next(error);
  }
}; 