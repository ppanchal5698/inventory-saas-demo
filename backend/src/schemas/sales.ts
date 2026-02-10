import { z } from 'zod';

export const customerSchema = z.object({
  customerCode: z.string().min(2).max(50),
  customerName: z.string().min(2).max(255),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
});

export const salesOrderSchema = z.object({
  customerId: z.number(),
  warehouseId: z.number(),
  orderDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    discount: z.number().optional().default(0),
    taxAmount: z.number().optional().default(0),
  })),
  notes: z.string().optional(),
});
