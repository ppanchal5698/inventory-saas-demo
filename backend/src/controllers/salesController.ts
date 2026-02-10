import { BaseController } from '../controllers/baseController';
import { Customer } from '../models/customer';
import { SalesOrder } from '../models/salesOrder';
import { SalesOrderItem } from '../models/salesOrderItem';
import { Stock } from '../models/stock';
import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../db/index';
import { generateId } from '../utils/idGenerator';
import { Model } from 'sequelize';

export class SalesController<T extends Model> extends BaseController<T> {
  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      const { customerId, warehouseId, orderDate, items, notes } = req.body;
      const organizationId = req.organizationId;
      const createdBy = req.user?.userId;

      const orderNumber = generateId('SO');

      const order = await SalesOrder.create({
        organizationId,
        orderNumber,
        customerId,
        warehouseId,
        orderDate,
        status: 'pending',
        paymentStatus: 'unpaid',
        notes,
        createdBy,
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
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

        await SalesOrderItem.create({
          orderId: order.orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxAmount: item.taxAmount,
          discount: item.discount,
        }, { transaction });

        // Update Stock Reservation
        const stock = await Stock.findOne({ where: { productId: item.productId, warehouseId } });
        if (stock) {
          stock.quantityReserved += item.quantity;
          await stock.save({ transaction });
        } else {
          // If no stock record, create one with 0 on hand and N reserved (overselling allowed depending on business logic)
           await Stock.create({
            productId: item.productId,
            warehouseId,
            quantityOnHand: 0,
            quantityReserved: item.quantity,
          }, { transaction });
        }
      }

      order.subtotal = subtotal.toString();
      order.taxAmount = taxAmount.toString();
      order.discountAmount = discountAmount.toString();
      order.totalAmount = (subtotal + taxAmount - discountAmount).toString();
      await order.save({ transaction });

      await transaction.commit();
      res.status(201).json({ status: 'success', data: order });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };
}

export const customerController = new SalesController(Customer);
export const salesOrderController = new SalesController(SalesOrder);
