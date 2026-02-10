import { z } from 'zod';

export const invoiceSchema = z.object({
  invoiceType: z.enum(['sales', 'purchase', 'credit_note', 'debit_note', 'proforma']),
  entityType: z.string().max(50),
  entityId: z.number(),
  invoiceDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  dueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  items: z.array(z.object({
    productId: z.number().optional(),
    description: z.string().min(1),
    quantity: z.number(),
    unitPrice: z.number(),
    taxAmount: z.number().optional().default(0),
    discount: z.number().optional().default(0),
  })),
});

export const paymentSchema = z.object({
  invoiceId: z.number().optional(),
  entityType: z.string().max(50),
  entityId: z.number(),
  paymentDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  amount: z.number().min(0),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'cheque', 'upi', 'wallet', 'other']),
  referenceNumber: z.string().max(100).optional(),
});
