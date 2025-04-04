import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { User } from '../models/user.model';
import { InventoryItem } from '../models/inventory.model';

export class ReportingService {
  private static instance: ReportingService;

  public static getInstance(): ReportingService {
    if (!this.instance) {
      this.instance = new ReportingService();
    }
    return this.instance;
  }

  public async generateInventoryReport(format: 'pdf' | 'excel'): Promise<Buffer> {
    const items = await InventoryItem.find().sort({ category: 1, name: 1 });
    
    if (format === 'pdf') {
      return this.generatePDFReport(items);
    } else {
      return this.generateExcelReport(items);
    }
  }

  private async generatePDFReport(items: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add company header
      doc.fontSize(20).text('Stock HR Management', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('Inventory Report', { align: 'center' });
      doc.moveDown();

      // Add date and time
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
      doc.moveDown();

      // Add inventory table
      const tableHeaders = ['Item', 'Category', 'Quantity', 'Price'];
      let yPosition = doc.y;

      // Draw headers
      tableHeaders.forEach((header, i) => {
        doc.text(header, 50 + (i * 130), yPosition);
      });

      // Draw items
      items.forEach((item, index) => {
        yPosition = doc.y + 20;
        doc.text(item.name, 50, yPosition);
        doc.text(item.category, 180, yPosition);
        doc.text(item.quantity.toString(), 310, yPosition);
        doc.text(`$${item.price.toFixed(2)}`, 440, yPosition);
      });

      doc.end();
    });
  }

  private async generateExcelReport(items: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    worksheet.columns = [
      { header: 'Item', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Total Value', key: 'totalValue', width: 15 },
      { header: 'Last Updated', key: 'updatedAt', width: 20 }
    ];

    items.forEach(item => {
      worksheet.addRow({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        totalValue: item.quantity * item.price,
        updatedAt: item.updatedAt.toLocaleDateString()
      });
    });

    return workbook.xlsx.writeBuffer();
  }
}
