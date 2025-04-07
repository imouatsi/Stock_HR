import PDFDocument from 'pdfkit';
import { Document } from '../types/document.types';
import { formatCurrency, formatDate } from '../utils/format';

export class PDFGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFGenerationError';
  }
}

export const pdfService = {
  async generateDocumentPDF(document: Document): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // Validate document data
        if (!document || !document.client || !document.items || document.items.length === 0) {
          throw new PDFGenerationError('Invalid document data');
        }

        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          bufferPages: true,
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (error) => {
          console.error('PDF generation error:', error);
          reject(new PDFGenerationError('Failed to generate PDF'));
        });

        // Header
        doc.fontSize(20).text(document.type === 'proforma' ? 'PROFORMA INVOICE' : 'INVOICE', {
          align: 'center',
        });
        doc.moveDown();

        // Document Info
        doc.fontSize(12);
        doc.text(`Document Number: ${document.id || 'N/A'}`);
        doc.text(`Date: ${formatDate(document.dueDate)}`);
        doc.text(`Status: ${(document.status || 'draft').toUpperCase()}`);
        doc.moveDown();

        // Client Info
        doc.text('Bill To:', { underline: true });
        doc.text(document.client.name || 'N/A');
        doc.text(document.client.address || 'N/A');
        if (document.client.nif) {
          doc.text(`NIF: ${document.client.nif}`);
        }
        doc.moveDown();

        // Items Table
        const tableTop = doc.y;
        const itemWidth = 300;
        const quantityWidth = 100;
        const priceWidth = 100;
        const totalWidth = 100;

        // Table Header
        doc.font('Helvetica-Bold');
        doc.text('Description', 50, tableTop);
        doc.text('Quantity', 50 + itemWidth, tableTop);
        doc.text('Unit Price', 50 + itemWidth + quantityWidth, tableTop);
        doc.text('Total', 50 + itemWidth + quantityWidth + priceWidth, tableTop);
        doc.moveDown();

        // Table Rows
        doc.font('Helvetica');
        let y = doc.y;
        let total = 0;

        document.items.forEach((item) => {
          if (!item.description || !item.quantity || !item.unitPrice) {
            throw new PDFGenerationError('Invalid item data');
          }

          const itemTotal = item.quantity * item.unitPrice;
          total += itemTotal;

          // Check if we need a new page
          if (y > 700) {
            doc.addPage();
            y = 50;
          }

          doc.text(item.description, 50, y);
          doc.text(item.quantity.toString(), 50 + itemWidth, y);
          doc.text(formatCurrency(item.unitPrice), 50 + itemWidth + quantityWidth, y);
          doc.text(formatCurrency(itemTotal), 50 + itemWidth + quantityWidth + priceWidth, y);
          y += 20;
        });

        // Check if we need a new page for the total
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        // Total
        doc.moveDown();
        doc.font('Helvetica-Bold');
        doc.text(
          'Total:',
          50 + itemWidth + quantityWidth,
          y,
          { width: priceWidth, align: 'right' }
        );
        doc.text(formatCurrency(total), 50 + itemWidth + quantityWidth + priceWidth, y);

        // Payment Terms
        if (document.paymentTerms) {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
          doc.moveDown(2);
          doc.font('Helvetica');
          doc.text('Payment Terms:', { underline: true });
          doc.text(document.paymentTerms);
        }

        // QR Code
        if (document.qrCode) {
          if (y > 600) {
            doc.addPage();
            y = 50;
          }
          doc.moveDown(2);
          try {
            doc.image(document.qrCode, {
              fit: [100, 100],
              align: 'right',
            });
          } catch (error) {
            console.error('Error adding QR code:', error);
            // Continue without QR code
          }
        }

        // Signature
        if (document.signature) {
          if (y > 600) {
            doc.addPage();
            y = 50;
          }
          doc.moveDown(2);
          try {
            doc.text('Authorized Signature:', { underline: true });
            doc.image(document.signature, {
              fit: [150, 50],
            });
          } catch (error) {
            console.error('Error adding signature:', error);
            // Continue without signature
          }
        }

        doc.end();
      } catch (error) {
        if (error instanceof PDFGenerationError) {
          reject(error);
        } else {
          console.error('Unexpected error during PDF generation:', error);
          reject(new PDFGenerationError('Unexpected error during PDF generation'));
        }
      }
    });
  },
}; 