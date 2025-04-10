import { z } from 'zod';

// Schema for localized strings
const localizedStringSchema = z.object({
  en: z.string().min(1, 'English name is required').max(100, 'Name cannot be more than 100 characters'),
  fr: z.string().min(1, 'French name is required').max(100, 'Name cannot be more than 100 characters'),
  ar: z.string().min(1, 'Arabic name is required').max(100, 'Name cannot be more than 100 characters')
});

// Optional localized string schema
const optionalLocalizedStringSchema = z.object({
  en: z.string().max(500, 'Description cannot be more than 500 characters'),
  fr: z.string().max(500, 'Description cannot be more than 500 characters'),
  ar: z.string().max(500, 'Description cannot be more than 500 characters')
}).optional();

// Product creation schema
export const createProductSchema = z.object({
  code: z.string().max(50, 'Code cannot be more than 50 characters').optional(),
  name: localizedStringSchema,
  description: optionalLocalizedStringSchema,
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  unit: z.string().min(1, 'Unit is required'),
  purchasePrice: z.number().min(0, 'Purchase price cannot be negative'),
  sellingPrice: z.number().min(0, 'Selling price cannot be negative'),
  tvaRate: z.number().refine(val => [0, 9, 19].includes(val), {
    message: 'TVA rate must be 0%, 9%, or 19%'
  }),
  barcode: z.string().max(50, 'Barcode cannot be more than 50 characters').optional(),
  isActive: z.boolean().optional()
});

// Product update schema
export const updateProductSchema = createProductSchema.partial();

// Product filter schema
export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  supplier: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional()
});
