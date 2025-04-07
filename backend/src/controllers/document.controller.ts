import { Request, Response } from 'express';
import { Document, DocumentItem, DocumentStatus } from '../types/document.types';
import { auditService } from '../services/audit.service';
import { validateDocument } from '../validators/document.validator';
import { PDFGenerationError } from '../services/pdf.service';

export class DocumentControllerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DocumentControllerError';
  }
}

export const documentController = {
  async createDocument(req: Request, res: Response) {
    try {
      const documentData = req.body;
      const validationResult = validateDocument(documentData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationResult.errors 
        });
      }

      const document = await Document.create({
        ...documentData,
        status: 'draft',
        createdBy: req.user.id,
      });

      await auditService.logAction(
        'CREATE_DOCUMENT',
        'Document',
        document.id,
        { type: document.type, status: document.status }
      );

      res.status(201).json(document);
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ 
        error: 'Failed to create document',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  async getDocument(req: Request, res: Response) {
    try {
      const document = await Document.findById(req.params.id)
        .populate('client')
        .populate('items')
        .populate('createdBy', 'username email');

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ 
        error: 'Failed to fetch document',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  async updateDocument(req: Request, res: Response) {
    try {
      const documentData = req.body;
      const validationResult = validateDocument(documentData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationResult.errors 
        });
      }

      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Prevent updating final invoices
      if (document.type === 'final' && document.status === 'approved') {
        return res.status(400).json({ 
          error: 'Cannot update approved final invoice' 
        });
      }

      const updatedDocument = await Document.findByIdAndUpdate(
        req.params.id,
        { ...documentData, updatedBy: req.user.id },
        { new: true }
      );

      await auditService.logAction(
        'UPDATE_DOCUMENT',
        'Document',
        document.id,
        { 
          type: document.type, 
          status: document.status,
          changes: Object.keys(documentData)
        }
      );

      res.json(updatedDocument);
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ 
        error: 'Failed to update document',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  async deleteDocument(req: Request, res: Response) {
    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Prevent deleting final invoices
      if (document.type === 'final') {
        return res.status(400).json({ 
          error: 'Cannot delete final invoice' 
        });
      }

      await Document.findByIdAndDelete(req.params.id);

      await auditService.logAction(
        'DELETE_DOCUMENT',
        'Document',
        document.id,
        { type: document.type }
      );

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ 
        error: 'Failed to delete document',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Validate status transition
      if (!isValidStatusTransition(document.status, status)) {
        return res.status(400).json({ 
          error: 'Invalid status transition',
          currentStatus: document.status,
          attemptedStatus: status
        });
      }

      // Special handling for final invoices
      if (document.type === 'final' && status === 'approved') {
        // Additional validation for final invoices
        if (!document.client.nif) {
          return res.status(400).json({ 
            error: 'NIF is required for final invoice approval' 
          });
        }
      }

      document.status = status;
      document.updatedBy = req.user.id;
      await document.save();

      await auditService.logAction(
        'UPDATE_DOCUMENT_STATUS',
        'Document',
        document.id,
        { 
          oldStatus: document.status, 
          newStatus: status,
          type: document.type
        }
      );

      res.json(document);
    } catch (error) {
      console.error('Error updating document status:', error);
      res.status(500).json({ 
        error: 'Failed to update document status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  async generatePDF(req: Request, res: Response) {
    try {
      const document = await Document.findById(req.params.id)
        .populate('client')
        .populate('items');

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const pdfBuffer = await generateDocumentPDF(document);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${document.type}-${document.id}.pdf`
      );
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      if (error instanceof PDFGenerationError) {
        return res.status(400).json({ 
          error: 'PDF generation failed',
          message: error.message
        });
      }

      res.status(500).json({ 
        error: 'Failed to generate PDF',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },
};

function isValidStatusTransition(currentStatus: DocumentStatus, newStatus: DocumentStatus): boolean {
  const validTransitions: Record<DocumentStatus, DocumentStatus[]> = {
    draft: ['pending', 'draft'],
    pending: ['approved', 'rejected', 'draft'],
    approved: ['pending'],
    rejected: ['pending', 'draft'],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
} 