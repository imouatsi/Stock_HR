import QRCode from 'qrcode';
import { jsQR } from 'jsqr';

export const qrService = {
  async generateQRCode(data: string): Promise<string> {
    try {
      return await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 200,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  },

  async validateQRCode(qrCode: string): Promise<boolean> {
    try {
      // Basic validation - check if it's a valid data URL
      return qrCode.startsWith('data:image/png;base64,');
    } catch (error) {
      console.error('Error validating QR code:', error);
      return false;
    }
  },

  async scanQRCode(imageData: ImageData): Promise<string> {
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        return code.data;
      }
      throw new Error('No QR code found in image');
    } catch (error) {
      console.error('Failed to scan QR code:', error);
      throw new Error('Failed to scan QR code');
    }
  },

  async generateInvoiceQRCode(invoiceData: {
    invoiceNumber: string;
    amount: number;
    date: string;
    companyName: string;
    taxNumber: string;
  }): Promise<string> {
    const qrData = JSON.stringify({
      type: 'invoice',
      ...invoiceData,
    });
    return this.generateQRCode(qrData);
  },

  async generateProformaQRCode(proformaData: {
    proformaNumber: string;
    amount: number;
    date: string;
    companyName: string;
    taxNumber: string;
  }): Promise<string> {
    const qrData = JSON.stringify({
      type: 'proforma',
      ...proformaData,
    });
    return this.generateQRCode(qrData);
  },
}; 