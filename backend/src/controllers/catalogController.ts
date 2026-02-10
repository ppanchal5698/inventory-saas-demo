import { BaseController } from '../controllers/baseController';
import { Brand } from '../models/brand';
import { Category } from '../models/category';
import { UnitOfMeasure } from '../models/unitOfMeasure';
import { TaxRate } from '../models/taxRate';
import { Product } from '../models/product';
import { ProductImage } from '../models/productImage';
import { Request, Response, NextFunction } from 'express';
import { Model, ModelStatic } from 'sequelize';

export class CatalogController<T extends Model> extends BaseController<T> {
  constructor(model: ModelStatic<T>) {
    super(model);
  }

}

export const brandController = new CatalogController(Brand);
export const categoryController = new CatalogController(Category);
export const uomController = new CatalogController(UnitOfMeasure);
export const taxRateController = new CatalogController(TaxRate);
export const productController = new CatalogController(Product);

// Specific product logic for images, variants, bundles can be added here
