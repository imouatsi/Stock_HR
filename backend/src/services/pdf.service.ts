import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { IInvoice } from '../models/invoice.model';
import { IProforma } from '../models/proforma.model';
import { ICompany } from '../models/company.model';
import fs from 'fs';
import path from 'path';

export class PDFService {
  private static async generateQRCode(data: string): Promise<string> {
    try {
      return await QRCode.toDataURL(data);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  }

  private static async addCompanyHeader(doc: PDFKit.PDFDocument, company: ICompany) {
    // Add company logo if exists
    if (company.logo) {
      doc.image(company.logo, 50, 45, { width: 100 });
    }

    // Add company details
    doc.fontSize(12)
       .text(company.name, 50, 50)
       .fontSize(10)
       .text(company.address, 50, 70)
       .text(`NIF: ${company.nif}`, 50, 85);

    if (company.phone) {
      doc.text(`Tel: ${company.phone}`, 50, 100);
    }
    if (company.email) {
      doc.text(`Email: ${company.email}`, 50, 115);
    }
    if (company.website) {
      doc.text(`Web: ${company.website}`, 50, 130);
    }
  }

  private static async addClientDetails(doc: PDFKit.PDFDocument, client: { name: string; address: string; nif?: string }) {
    doc.fontSize(12)
       .text('Client:', 300, 50)
       .fontSize(10)
       .text(client.name, 300, 70)
       .text(client.address, 300, 85);

    if (client.nif) {
      doc.text(`NIF: ${client.nif}`, 300, 100);
    }
  }

  private static async addInvoiceDetails(doc: PDFKit.PDFDocument, invoice: IInvoice | IProforma) {
    const isProforma = 'type' in invoice && invoice.type === 'proforma';
    const title = isProforma ? 'Facture Proforma' : 'Facture Définitive';

    doc.fontSize(20)
       .text(title, 50, 180)
       .fontSize(12)
       .text(`Numéro: ${invoice.invoiceNumber}`, 50, 210)
       .text(`Date: ${invoice.date.toLocaleDateString('fr-FR')}`, 50, 225)
       .text(`Échéance: ${invoice.dueDate.toLocaleDateString('fr-FR')}`, 50, 240)
       .text(`Conditions de paiement: ${invoice.paymentTerms}`, 50, 255);
  }

  private static async addItemsTable(doc: PDFKit.PDFDocument, items: Array<{ description: string; quantity: number; unitPrice: number; total: number; barcode?: string }>) {
    const tableTop = 300;
    const itemX = 50;
    const quantityX = 250;
    const priceX = 350;
    const totalX = 450;

    // Table headers
    doc.fontSize(10)
       .text('Description', itemX, tableTop)
       .text('Quantité', quantityX, tableTop)
       .text('Prix unitaire', priceX, tableTop)
       .text('Total', totalX, tableTop);

    // Table rows
    let y = tableTop + 20;
    items.forEach(item => {
      doc.text(item.description, itemX, y)
         .text(item.quantity.toString(), quantityX, y)
         .text(item.unitPrice.toFixed(2), priceX, y)
         .text(item.total.toFixed(2), totalX, y);

      if (item.barcode) {
        // Add barcode if available
        // Note: You'll need to implement barcode generation
      }

      y += 20;
    });
  }

  private static async addTotals(doc: PDFKit.PDFDocument, invoice: IInvoice | IProforma) {
    const totalsY = 500;
    const labelX = 350;
    const valueX = 450;

    doc.fontSize(10)
       .text('Total HT:', labelX, totalsY)
       .text(invoice.subtotal.toFixed(2), valueX, totalsY)
       .text(`TVA (${invoice.vatRate}%):`, labelX, totalsY + 20)
       .text(invoice.vatAmount.toFixed(2), valueX, totalsY + 20)
       .fontSize(12)
       .text('Total TTC:', labelX, totalsY + 40)
       .text(invoice.total.toFixed(2), valueX, totalsY + 40);
  }

  private static async addSignature(doc: PDFKit.PDFDocument, signature?: string) {
    if (signature) {
      doc.image(signature, 50, 600, { width: 150 });
    }
    doc.fontSize(10)
       .text('Signature', 50, 650);
  }

  private static async addQRCode(doc: PDFKit.PDFDocument, qrCode?: string) {
    if (qrCode) {
      doc.image(qrCode, 450, 600, { width: 100 });
    }
  }

  public static async generateInvoicePDF(invoice: IInvoice | IProforma, company: ICompany): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const fileName = `Facture_${invoice.invoiceNumber}_${invoice.client.name}_${invoice.date.toISOString().split('T')[0]}.pdf`;
        const filePath = path.join(__dirname, '../../uploads/invoices', fileName);

        // Create directory if it doesn't exist
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Add content to PDF
        await this.addCompanyHeader(doc, company);
        await this.addClientDetails(doc, invoice.client);
        await this.addInvoiceDetails(doc, invoice);
        await this.addItemsTable(doc, invoice.items);
        await this.addTotals(doc, invoice);
        await this.addSignature(doc, invoice.signature);
        await this.addQRCode(doc, invoice.qrCode);

        doc.end();

        stream.on('finish', () => {
          resolve(filePath);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
} 