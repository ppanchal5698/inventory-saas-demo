import { BaseRepository } from './baseRepository';
import { Stock } from '../models/stock';
import { StockAdjustment } from '../models/stockAdjustment';
import { StockTransfer } from '../models/stockTransfer';
import { Transaction } from 'sequelize';

export class InventoryRepository extends BaseRepository<Stock> {
  constructor() {
    super(Stock);
  }

  async findStock(productId: number, warehouseId: number): Promise<Stock | null> {
    return this.model.findOne({ where: { productId, warehouseId } });
  }

  async createStockAdjustment(data: any, transaction?: Transaction) {
    return StockAdjustment.create(data, { transaction });
  }

  async createStockTransfer(data: any, transaction?: Transaction) {
    return StockTransfer.create(data, { transaction });
  }
}

export const inventoryRepository = new InventoryRepository();
