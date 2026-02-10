import { BaseRepository } from './baseRepository';
import { Product } from '../models/product';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(Product);
  }
}

export const productRepository = new ProductRepository();
