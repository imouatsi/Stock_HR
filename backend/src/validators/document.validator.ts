import { z } from 'zod';
import { DocumentType, DocumentStatus } from '../types/document.types';

export const ClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  address: z.string().min(1, 'Client address is required'),
  nif: z.string().optional(),
});

export const DocumentItemSchema = z.object({
  description: z.string().min(1, 'Item description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  barcode: z.string().optional(),
});

export const DocumentSchema = z.object({
  type: z.enum(['proforma', 'final'] as const),
  client: ClientSchema,
  items: z.array(DocumentItemSchema).min(1, 'At least one item is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  dueDate: z.date(),
  status: z.enum(['draft', 'pending', 'approved', 'rejected'] as const).optional(),
  qrCode: z.string().optional(),
  signature: z.string().optional(),
});

export function validateDocument(data: unknown) {
  try {
    const validatedData = DocumentSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ path: 'unknown', message: 'Unknown validation error' }],
    };
  }
} 