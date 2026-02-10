import { z } from 'zod';

export const brandSchema = z.object({
  brandName: z.string().min(2).max(200),
  manufacturerName: z.string().max(200).optional(),
});

export const categorySchema = z.object({
  categoryName: z.string().min(2).max(200),
  parentCategoryId: z.number().optional(),
});

export const uomSchema = z.object({
  uomName: z.string().min(1).max(100),
  abbreviation: z.string().min(1).max(20),
  uomType: z.string().min(1).max(50),
});

export const taxRateSchema = z.object({
  taxName: z.string().min(2).max(100),
  taxType: z.enum(['vat', 'gst', 'sales_tax', 'excise', 'custom']),
  rate: z.number().min(0),
});

export const productSchema = z.object({
  productCode: z.string().min(2).max(100),
  productName: z.string().min(2).max(255),
  categoryId: z.number().optional(),
  brandId: z.number().optional(),
  unitPrice: z.number().min(0),
  costPrice: z.number().min(0).optional(),
  listPrice: z.number().min(0).optional(),
  taxRateId: z.number().optional(),
  uomId: z.number().optional(),
  isActive: z.boolean().default(true),
});
