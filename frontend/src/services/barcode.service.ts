import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';

class BarcodeService {
  generateBarcode(
    data: string,
    options: {
      format: 'CODE128' | 'EAN13' | 'UPC' | 'CODE39';
      width?: number;
      height?: number;
      displayValue?: boolean;
    } = {
      format: 'CODE128',
      width: 2,
      height: 100,
      displayValue: true,
    }
  ): string {
    try {
      const canvas = createCanvas(200, 200);
      JsBarcode(canvas, data, {
        format: options.format,
        width: options.width,
        height: options.height,
        displayValue: options.displayValue,
        margin: 10,
      });
      return canvas.toDataURL();
    } catch (error) {
      console.error('Failed to generate barcode:', error);
      throw new Error('Failed to generate barcode');
    }
  }

  generateProductBarcode(productData: {
    productId: string;
    sku: string;
    price: number;
  }): string {
    const barcodeData = `${productData.productId}-${productData.sku}`;
    return this.generateBarcode(barcodeData, {
      format: 'CODE128',
      width: 2,
      height: 100,
      displayValue: true,
    });
  }

  generateInventoryBarcode(inventoryData: {
    itemId: string;
    location: string;
    quantity: number;
  }): string {
    const barcodeData = `${inventoryData.itemId}-${inventoryData.location}`;
    return this.generateBarcode(barcodeData, {
      format: 'CODE128',
      width: 2,
      height: 100,
      displayValue: true,
    });
  }
}

export const barcodeService = new BarcodeService(); 