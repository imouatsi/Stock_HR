import { IFinancialStatement } from '../interfaces/financial-statement.interface';
import PDFDocument from 'pdfkit';

// Generate PDF from financial statement
export const generatePDF = async (statement: IFinancialStatement): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Buffer to store PDF
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add content to PDF based on statement type
      addPDFHeader(doc, statement);

      if (statement.type === 'balance_sheet') {
        addBalanceSheetContent(doc, statement);
      } else if (statement.type === 'income_statement') {
        addIncomeStatementContent(doc, statement);
      } else if (statement.type === 'cash_flow') {
        addCashFlowStatementContent(doc, statement);
      }

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generate Excel from financial statement
export const generateExcel = async (statement: IFinancialStatement): Promise<Buffer> => {
  // In a real implementation, this would use a library like exceljs
  // For now, we'll return a simple buffer
  return Buffer.from('Excel file content');
};

// Helper function to add PDF header
const addPDFHeader = (doc: PDFKit.PDFDocument, statement: IFinancialStatement) => {
  // Add company logo and information
  doc.fontSize(20).text('404 ENTERPRISE', { align: 'center' });
  doc.moveDown();

  // Add statement title
  let title = '';
  if (statement.type === 'balance_sheet') {
    title = 'Bilan';
  } else if (statement.type === 'income_statement') {
    title = 'Compte de Résultat';
  } else if (statement.type === 'cash_flow') {
    title = 'Tableau des Flux de Trésorerie';
  }

  doc.fontSize(16).text(title, { align: 'center' });
  doc.moveDown();

  // Add date
  doc.fontSize(12).text(`Date: ${statement.date}`, { align: 'center' });
  doc.moveDown();

  // Add status
  doc.fontSize(12).text(`Statut: ${statement.status === 'draft' ? 'Brouillon' : 'Final'}`, { align: 'center' });
  doc.moveDown(2);
};

// Helper function to add balance sheet content
const addBalanceSheetContent = (doc: PDFKit.PDFDocument, statement: IFinancialStatement) => {
  const data = statement.data as any;

  // Add assets section
  doc.fontSize(14).text('ACTIFS', { underline: true });
  doc.moveDown();

  // Non-current assets
  doc.fontSize(12).text(`${data.assets.nonCurrentAssets.code} - ${data.assets.nonCurrentAssets.label}`);
  doc.moveDown(0.5);

  data.assets.nonCurrentAssets.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.assets.nonCurrentAssets.label}: ${formatCurrency(data.assets.nonCurrentAssets.total)}`);
  doc.moveDown();

  // Current assets
  doc.fontSize(12).text(`${data.assets.currentAssets.code} - ${data.assets.currentAssets.label}`);
  doc.moveDown(0.5);

  data.assets.currentAssets.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.assets.currentAssets.label}: ${formatCurrency(data.assets.currentAssets.total)}`);
  doc.moveDown();

  // Total assets
  doc.fontSize(12).text(`TOTAL ACTIFS: ${formatCurrency(data.totalAssets)}`);
  doc.moveDown(2);

  // Add liabilities section
  doc.fontSize(14).text('PASSIFS', { underline: true });
  doc.moveDown();

  // Equity
  doc.fontSize(12).text(`${data.liabilities.equity.code} - ${data.liabilities.equity.label}`);
  doc.moveDown(0.5);

  data.liabilities.equity.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.liabilities.equity.label}: ${formatCurrency(data.liabilities.equity.total)}`);
  doc.moveDown();

  // Non-current liabilities
  doc.fontSize(12).text(`${data.liabilities.nonCurrentLiabilities.code} - ${data.liabilities.nonCurrentLiabilities.label}`);
  doc.moveDown(0.5);

  data.liabilities.nonCurrentLiabilities.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.liabilities.nonCurrentLiabilities.label}: ${formatCurrency(data.liabilities.nonCurrentLiabilities.total)}`);
  doc.moveDown();

  // Current liabilities
  doc.fontSize(12).text(`${data.liabilities.currentLiabilities.code} - ${data.liabilities.currentLiabilities.label}`);
  doc.moveDown(0.5);

  data.liabilities.currentLiabilities.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.liabilities.currentLiabilities.label}: ${formatCurrency(data.liabilities.currentLiabilities.total)}`);
  doc.moveDown();

  // Total liabilities
  doc.fontSize(12).text(`TOTAL PASSIFS: ${formatCurrency(data.totalLiabilities)}`);
};

// Helper function to add income statement content
const addIncomeStatementContent = (doc: PDFKit.PDFDocument, statement: IFinancialStatement) => {
  const data = statement.data as any;

  // Add period information
  doc.fontSize(12).text(`Période: ${data.startDate} - ${data.endDate}`);
  doc.moveDown(2);

  // Operating revenue
  doc.fontSize(14).text(`${data.operatingRevenue.code} - ${data.operatingRevenue.label}`, { underline: true });
  doc.moveDown(0.5);

  data.operatingRevenue.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.operatingRevenue.label}: ${formatCurrency(data.operatingRevenue.total)}`);
  doc.moveDown();

  // Operating expenses
  doc.fontSize(14).text(`${data.operatingExpenses.code} - ${data.operatingExpenses.label}`, { underline: true });
  doc.moveDown(0.5);

  data.operatingExpenses.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.operatingExpenses.label}: ${formatCurrency(data.operatingExpenses.total)}`);
  doc.moveDown();

  // Operating result
  doc.fontSize(12).text(`Résultat d'exploitation: ${formatCurrency(data.operatingResult)}`);
  doc.moveDown();

  // Financial revenue and expenses
  doc.fontSize(14).text(`${data.financialRevenue.code} - ${data.financialRevenue.label}`, { underline: true });
  doc.moveDown(0.5);

  data.financialRevenue.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.financialRevenue.label}: ${formatCurrency(data.financialRevenue.total)}`);
  doc.moveDown();

  doc.fontSize(14).text(`${data.financialExpenses.code} - ${data.financialExpenses.label}`, { underline: true });
  doc.moveDown(0.5);

  data.financialExpenses.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.financialExpenses.label}: ${formatCurrency(data.financialExpenses.total)}`);
  doc.moveDown();

  // Financial result
  doc.fontSize(12).text(`Résultat financier: ${formatCurrency(data.financialResult)}`);
  doc.moveDown();

  // Ordinary result
  doc.fontSize(12).text(`Résultat ordinaire: ${formatCurrency(data.ordinaryResult)}`);
  doc.moveDown();

  // Taxes
  doc.fontSize(14).text(`${data.taxes.code} - ${data.taxes.label}`, { underline: true });
  doc.moveDown(0.5);

  data.taxes.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.taxes.label}: ${formatCurrency(data.taxes.total)}`);
  doc.moveDown();

  // Net result
  doc.fontSize(14).text(`Résultat net: ${formatCurrency(data.netResult)}`);
};

// Helper function to add cash flow statement content
const addCashFlowStatementContent = (doc: PDFKit.PDFDocument, statement: IFinancialStatement) => {
  const data = statement.data as any;

  // Add period information
  doc.fontSize(12).text(`Période: ${data.startDate} - ${data.endDate}`);
  doc.moveDown(2);

  // Operating activities
  doc.fontSize(14).text(`${data.operatingActivities.code} - ${data.operatingActivities.label}`, { underline: true });
  doc.moveDown(0.5);

  data.operatingActivities.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.operatingActivities.label}: ${formatCurrency(data.operatingActivities.total)}`);
  doc.moveDown();

  // Investing activities
  doc.fontSize(14).text(`${data.investingActivities.code} - ${data.investingActivities.label}`, { underline: true });
  doc.moveDown(0.5);

  data.investingActivities.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.investingActivities.label}: ${formatCurrency(data.investingActivities.total)}`);
  doc.moveDown();

  // Financing activities
  doc.fontSize(14).text(`${data.financingActivities.code} - ${data.financingActivities.label}`, { underline: true });
  doc.moveDown(0.5);

  data.financingActivities.items.forEach((item: any) => {
    doc.fontSize(10).text(`${item.code} - ${item.label}: ${formatCurrency(item.value)}`);
  });

  doc.fontSize(12).text(`Total ${data.financingActivities.label}: ${formatCurrency(data.financingActivities.total)}`);
  doc.moveDown();

  // Net change in cash
  doc.fontSize(12).text(`Variation de trésorerie: ${formatCurrency(data.netChangeInCash)}`);
  doc.moveDown();

  // Cash balances
  doc.fontSize(12).text(`Trésorerie d'ouverture: ${formatCurrency(data.openingCashBalance)}`);
  doc.fontSize(12).text(`Trésorerie de clôture: ${formatCurrency(data.closingCashBalance)}`);
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2
  }).format(amount);
};
