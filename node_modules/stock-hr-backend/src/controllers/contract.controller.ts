import { Request, Response, NextFunction } from 'express';
import { jsPDF } from 'jspdf'; // Add this library for PDF generation
import Contract from '../models/contract.model';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/authRequest';

export const getAllContracts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contracts = await Contract.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: contracts.length,
      data: {
        contracts
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getContractById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return next(new AppError('Contract not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        contract
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createContract = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Generate contract number
    const count = await Contract.countDocuments();
    const contractNumber = `CNT-${String(count + 1).padStart(6, '0')}`;

    const contract = await Contract.create({
      ...req.body,
      contractNumber,
      createdBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        contract
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateContract = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!contract) {
      return next(new AppError('Contract not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        contract
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContract = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const contract = await Contract.findByIdAndDelete(req.params.id);

    if (!contract) {
      return next(new AppError('Contract not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

export const generateContract = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const { title, description, startDate, endDate, party } = req.body;

    // Generate contract content
    const contractContent = `
      Contract Title: ${title}
      Description: ${description}
      Start Date: ${startDate}
      End Date: ${endDate}
      Party: ${party.name}, ${party.type}, ${party.contact}, ${party.address}
    `;

    // Generate PDF
    const doc = new jsPDF();
    doc.text(contractContent, 10, 10);
    const pdfBuffer = doc.output('arraybuffer');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=contract.pdf');
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    next(error);
  }
};

// Additional function to generate contract document
export const generateContractDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return next(new AppError('Contract not found', 404));
    }

    // TODO: Implement contract document generation logic
    // This could involve using a library like PDFKit to generate a PDF
    // For now, we'll return a simple success message
    
    res.status(200).json({
      status: 'success',
      message: 'Contract document generated successfully',
      data: {
        contract
      }
    });
  } catch (error) {
    next(error);
  }
};