import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Supplier } from '../models/supplier.model';
import { Warehouse } from '../models/warehouse.model';

/**
 * Generates a unique product code
 * Format: P-YYYYMMDD-XXXX (where XXXX is a sequential number)
 */
export const generateProductCode = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Find the latest product code with today's date
  const latestProduct = await Product.findOne(
    { code: { $regex: `^P-${dateStr}-` } },
    { code: 1 },
    { sort: { code: -1 } }
  );
  
  let sequenceNumber = 1;
  
  if (latestProduct) {
    const parts = latestProduct.code.split('-');
    if (parts.length === 3) {
      sequenceNumber = parseInt(parts[2], 10) + 1;
    }
  }
  
  return `P-${dateStr}-${sequenceNumber.toString().padStart(4, '0')}`;
};

/**
 * Generates a unique category code
 * Format: C-XXX (where XXX is a sequential number)
 */
export const generateCategoryCode = async (): Promise<string> => {
  // Find the latest category code
  const latestCategory = await Category.findOne(
    { code: { $regex: '^C-' } },
    { code: 1 },
    { sort: { code: -1 } }
  );
  
  let sequenceNumber = 1;
  
  if (latestCategory) {
    const parts = latestCategory.code.split('-');
    if (parts.length === 2) {
      sequenceNumber = parseInt(parts[1], 10) + 1;
    }
  }
  
  return `C-${sequenceNumber.toString().padStart(3, '0')}`;
};

/**
 * Generates a unique supplier code
 * Format: S-XXX (where XXX is a sequential number)
 */
export const generateSupplierCode = async (): Promise<string> => {
  // Find the latest supplier code
  const latestSupplier = await Supplier.findOne(
    { code: { $regex: '^S-' } },
    { code: 1 },
    { sort: { code: -1 } }
  );
  
  let sequenceNumber = 1;
  
  if (latestSupplier) {
    const parts = latestSupplier.code.split('-');
    if (parts.length === 2) {
      sequenceNumber = parseInt(parts[1], 10) + 1;
    }
  }
  
  return `S-${sequenceNumber.toString().padStart(3, '0')}`;
};

/**
 * Generates a unique warehouse code
 * Format: W-XXX (where XXX is a sequential number)
 */
export const generateWarehouseCode = async (): Promise<string> => {
  // Find the latest warehouse code
  const latestWarehouse = await Warehouse.findOne(
    { code: { $regex: '^W-' } },
    { code: 1 },
    { sort: { code: -1 } }
  );
  
  let sequenceNumber = 1;
  
  if (latestWarehouse) {
    const parts = latestWarehouse.code.split('-');
    if (parts.length === 2) {
      sequenceNumber = parseInt(parts[1], 10) + 1;
    }
  }
  
  return `W-${sequenceNumber.toString().padStart(3, '0')}`;
};
