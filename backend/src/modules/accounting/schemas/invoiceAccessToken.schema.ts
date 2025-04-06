import { z } from 'zod';

export const invoiceAccessTokenSchema = z.object({
  invoice: z.string().min(1, 'Invoice ID is required'),
  operation: z.enum(['payment', 'cancellation', 'approval']),
  details: z.object({
    amount: z.number().positive().optional(),
    paymentMethod: z.string().optional(),
    reason: z.string().optional()
  }).refine((data) => {
    if (data.amount !== undefined && data.paymentMethod === undefined) {
      return false;
    }
    return true;
  }, {
    message: 'Payment method is required when amount is provided'
  })
});

export type InvoiceAccessTokenRequest = z.infer<typeof invoiceAccessTokenSchema>; 