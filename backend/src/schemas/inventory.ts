import { z } from 'zod';

export const warehouseSchema = z.object({
  warehouseCode: z.string().min(2).max(50),
  warehouseName: z.string().min(2).max(200),
  warehouseType: z.string().max(50).optional(),
  cityId: z.number().optional(),
  managerUserId: z.number().optional(),
});

export const stockLocationSchema = z.object({
  warehouseId: z.number(),
  locationType: z.enum(['zone', 'aisle', 'rack', 'shelf', 'bin']),
  locationCode: z.string().min(1).max(50),
  parentLocationId: z.number().optional(),
});

export const stockAdjustmentSchema = z.object({
  productId: z.number(),
  warehouseId: z.number(),
  batchId: z.number().optional(),
  newQuantity: z.number().min(0),
  reason: z.enum(['count_discrepancy', 'damage', 'theft', 'expiry', 'correction', 'other']),
  notes: z.string().optional(),
});

export const stockTransferSchema = z.object({
  fromWarehouseId: z.number(),
  toWarehouseId: z.number(),
  transferDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  items: z.array(z.object({
    productId: z.number(),
    quantityRequested: z.number().min(1),
  })),
});
