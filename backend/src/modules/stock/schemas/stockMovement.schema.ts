import { z } from 'zod';

export const stockMovementSchema = z.object({
  inventoryItem: z.string().min(1, 'Inventory item ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  type: z.enum(['in', 'out', 'transfer']),
  source: z.string().optional(),
  destination: z.string().optional(),
  notes: z.string().optional(),
  timestamp: z.string().optional(),
  accessToken: z.string().optional()
}).refine((data) => {
  // For transfers, source and destination are required
  if (data.type === 'transfer') {
    return !!data.source && !!data.destination;
  }
  return true;
}, {
  message: 'Source and destination are required for transfer movements',
  path: ['source']
}).refine((data) => {
  // For outgoing movements, access token is required
  if (data.type === 'out') {
    return !!data.accessToken;
  }
  return true;
}, {
  message: 'Access token is required for outgoing movements',
  path: ['accessToken']
});

export type StockMovementRequest = z.infer<typeof stockMovementSchema>; 