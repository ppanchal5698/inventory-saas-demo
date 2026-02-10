import { z } from 'zod';

export const supplierSchema = z.object({
  supplierCode: z.string().min(2).max(50),
  supplierName: z.string().min(2).max(255),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional(),
  cityId: z.number().optional(),
});

export const purchaseOrderSchema = z.object({
  supplierId: z.number(),
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

export const grnSchema = z.object({
  poId: z.number().optional(),
  warehouseId: z.number(),
  receiptDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  items: z.array(z.object({
    productId: z.number(),
    quantityReceived: z.number().min(0),
    quantityAccepted: z.number().min(0),
    quantityRejected: z.number().optional().default(0),
    batchId: z.number().optional(),
    rejectionReason: z.string().optional(),
  })),
});
