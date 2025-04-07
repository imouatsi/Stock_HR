import { z } from 'zod';

export const stockSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot be more than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description cannot be more than 500 characters')
    .trim()
    .optional(),
  quantity: z.number()
    .min(0, 'Quantity cannot be negative')
    .int('Quantity must be a whole number'),
  unitPrice: z.number()
    .min(0, 'Unit price cannot be negative')
    .multipleOf(0.01, 'Unit price must have at most 2 decimal places'),
  category: z.string()
    .min(1, 'Category is required')
    .trim(),
  supplier: z.string()
    .min(1, 'Supplier is required')
    .trim(),
  reorderPoint: z.number()
    .min(0, 'Reorder point cannot be negative')
    .int('Reorder point must be a whole number'),
  location: z.string()
    .trim()
    .optional(),
}); 