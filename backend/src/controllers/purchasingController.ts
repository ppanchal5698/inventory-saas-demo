import { BaseController } from '../controllers/baseController';
import { Supplier } from '../models/supplier';
import { PurchaseOrder } from '../models/purchaseOrder';
import { PurchaseOrderItem } from '../models/purchaseOrderItem';
import { GoodsReceiptNote } from '../models/goodsReceiptNote';
import { GoodsReceiptNoteItem } from '../models/goodsReceiptNoteItem';
import { Stock } from '../models/stock';
import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../db/index';
import { generateId } from '../utils/idGenerator';
import { Model } from 'sequelize';

export class PurchasingController<T extends Model> extends BaseController<T> {
  createPO = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      const { supplierId, warehouseId, orderDate, items, notes } = req.body;
      const organizationId = req.organizationId;
      const createdBy = req.user?.userId;

      const poNumber = generateId('PO');

      const po = await PurchaseOrder.create({
        organizationId,
        poNumber,
        supplierId,
        warehouseId,
        orderDate,
        status: 'draft',
        paymentStatus: 'unpaid',
        notes,
        createdBy,
        subtotal: 0,
        taxAmount: 0,
        discount: 0,
        totalAmount: 0,
      }, { transaction });

      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;

      for (const item of items) {
        const lineTotal = (item.quantity * item.unitPrice) + (item.taxAmount || 0) - (item.discount || 0);
        subtotal += item.quantity * item.unitPrice;
        taxAmount += item.taxAmount || 0;
        discountAmount += item.discount || 0;

        await PurchaseOrderItem.create({
          poId: po.poId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxAmount: item.taxAmount,
          discount: item.discount,
        }, { transaction });
      }

      po.subtotal = subtotal.toString();
      po.taxAmount = taxAmount.toString();
      po.discount = discountAmount.toString();
      po.totalAmount = (subtotal + taxAmount - discountAmount).toString();
      await po.save({ transaction });

      await transaction.commit();
      res.status(201).json({ status: 'success', data: po });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };

  createGRN = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      const { poId, warehouseId, receiptDate, items } = req.body;
      const organizationId = req.organizationId;
      const receivedBy = req.user?.userId;

      const grnNumber = generateId('GRN');

      const grn = await GoodsReceiptNote.create({
        organizationId,
        grnNumber,
        poId,
        warehouseId,
        receiptDate,
        receivedBy,
        qualityStatus: 'pending',
      }, { transaction });

      for (const item of items) {
        await GoodsReceiptNoteItem.create({
          grnId: grn.grnId,
          productId: item.productId,
          batchId: item.batchId,
          quantityReceived: item.quantityReceived,
          quantityAccepted: item.quantityAccepted,
          quantityRejected: item.quantityRejected,
          rejectionReason: item.rejectionReason,
        }, { transaction });

        // Update Stock
        const stock = await Stock.findOne({ where: { productId: item.productId, warehouseId } });
        if (stock) {
          stock.quantityOnHand += item.quantityAccepted;
          await stock.save({ transaction });
        } else {
          await Stock.create({
            productId: item.productId,
            warehouseId,
            quantityOnHand: item.quantityAccepted,
          }, { transaction });
        }

        // If PO ID exists, update received quantity in PO Items (simplified logic here)
      }

      await transaction.commit();
      res.status(201).json({ status: 'success', data: grn });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };
}

export const supplierController = new PurchasingController(Supplier);
export const purchaseOrderController = new PurchasingController(PurchaseOrder);
export const grnController = new PurchasingController(GoodsReceiptNote);
