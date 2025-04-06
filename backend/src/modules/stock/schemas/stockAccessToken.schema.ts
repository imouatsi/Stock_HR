import { z } from 'zod';

export const stockAccessTokenSchema = z.object({
  inventoryItem: z.string().min(1, 'Inventory item ID is required'),
  operation: z.enum(['sale', 'transfer', 'adjustment']),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  details: z.object({
    destination: z.string().optional(),
    reason: z.string().optional()
  }).refine((data) => {
    // Ensure destination is provided for transfer operations
    if (data.destination === undefined && data.reason === undefined) {
      return true; // For sale operations
    }
    return data.destination !== undefined || data.reason !== undefined;
  }, {
    message: 'Either destination (for transfer) or reason (for adjustment) must be provided'
  })
});

export type StockAccessTokenRequest = z.infer<typeof stockAccessTokenSchema>; 