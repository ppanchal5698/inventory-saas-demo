import { BaseController } from '../controllers/baseController';
import { Warehouse } from '../models/warehouse';
import { StockLocation } from '../models/stockLocation';
import { StockAdjustment } from '../models/stockAdjustment';
import { Stock } from '../models/stock';
import { StockTransfer } from '../models/stockTransfer';
import { StockTransferItem } from '../models/stockTransferItem';
import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../db/index';
import { AppError } from '../middleware/errorHandler';
import { generateId } from '../utils/idGenerator';
import { Model } from 'sequelize';

export class InventoryController<T extends Model> extends BaseController<T> {
  createAdjustment = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      const { productId, warehouseId, batchId, newQuantity, reason, notes } = req.body;
      const organizationId = req.organizationId;

      // Check current stock
      const stock = await Stock.findOne({ where: { productId, warehouseId } });
      const oldQuantity = stock ? stock.quantityOnHand : 0;

      const adjustment = await StockAdjustment.create({
        organizationId,
        adjustmentNumber: generateId('ADJ'),
        productId,
        warehouseId,
        batchId,
        oldQuantity,
        newQuantity,
        reason,
        notes,
        adjustmentDate: new Date(),
        adjustedBy: req.user?.userId,
      }, { transaction });

      // Update Stock Table
      if (stock) {
        stock.quantityOnHand = newQuantity;
        await stock.save({ transaction });
      } else {
        await Stock.create({
          productId,
          warehouseId,
          quantityOnHand: newQuantity,
          quantityReserved: 0,
        }, { transaction });
      }

      await transaction.commit();
      res.status(201).json({ status: 'success', data: adjustment });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };

  createTransfer = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      const { fromWarehouseId, toWarehouseId, transferDate, items } = req.body;
      const organizationId = req.organizationId;

      const transfer = await StockTransfer.create({
        organizationId,
        transferNumber: generateId('TRF'),
        fromWarehouseId,
        toWarehouseId,
        transferDate,
        status: 'draft',
        createdBy: req.user?.userId,
      }, { transaction });

      // Create items
      for (const item of items) {
        await StockTransferItem.create({
          transferId: transfer.transferId,
          productId: item.productId,
          quantityRequested: item.quantityRequested,
        }, { transaction });
      }

      await transaction.commit();
      res.status(201).json({ status: 'success', data: transfer });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };
}

export const warehouseController = new InventoryController(Warehouse);
export const stockLocationController = new InventoryController(StockLocation);
export const stockAdjustmentController = new InventoryController(StockAdjustment);
export const stockTransferController = new InventoryController(StockTransfer);
