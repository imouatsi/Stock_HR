import { z } from 'zod';

export const employeeAccessTokenSchema = z.object({
  employee: z.string().min(1, 'Employee ID is required'),
  operation: z.enum(['status_change', 'asset_assignment', 'leave_approval']),
  details: z.object({
    newStatus: z.string().optional(),
    reason: z.string().optional(),
    assetId: z.string().optional(),
    leaveRequestId: z.string().optional()
  })
});

export type EmployeeAccessTokenRequest = z.infer<typeof employeeAccessTokenSchema>; 