import { z } from 'zod';

export const purchaseOrderAccessTokenSchema = z.object({
  purchaseOrder: z.string().min(1, 'Purchase order ID is required'),
  operation: z.enum(['receive', 'cancel', 'approve']),
  items: z.array(z.object({
    product: z.string().min(1, 'Product ID is required'),
    quantity: z.number().positive('Quantity must be positive')
  })).optional()
});

export type PurchaseOrderAccessTokenRequest = z.infer<typeof purchaseOrderAccessTokenSchema>; 