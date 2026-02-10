import { BaseController } from '../controllers/baseController';
import { Invoice } from '../models/invoice';
import { InvoiceItem } from '../models/invoiceItem';
import { Payment } from '../models/payment';
import { PaymentAllocation } from '../models/paymentAllocation';
import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../db/index';
import { generateId } from '../utils/idGenerator';
import { Model } from 'sequelize';

export class FinanceController<T extends Model> extends BaseController<T> {
  createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      const { invoiceType, entityType, entityId, invoiceDate, dueDate, items } = req.body;
      const organizationId = req.organizationId;
      const createdBy = req.user?.userId;

      const invoiceNumber = generateId('INV');

      const invoice = await Invoice.create({
        organizationId,
        invoiceNumber,
        invoiceType,
        entityType,
        entityId,
        invoiceDate,
        dueDate,
        status: 'draft',
        createdBy,
        subtotal: 0,
        taxAmount: 0,
        discount: 0,
        totalAmount: 0,
        paidAmount: 0,
      }, { transaction });

      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;

      for (const item of items) {
        subtotal += item.quantity * item.unitPrice;
        taxAmount += item.taxAmount || 0;
        discountAmount += item.discount || 0;

        await InvoiceItem.create({
          invoiceId: invoice.invoiceId,
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxAmount: item.taxAmount,
          discount: item.discount,
        }, { transaction });
      }

      invoice.subtotal = subtotal.toString();
      invoice.taxAmount = taxAmount.toString();
      invoice.discount = discountAmount.toString();
      invoice.totalAmount = (subtotal + taxAmount - discountAmount).toString();
      await invoice.save({ transaction });

      await transaction.commit();
      res.status(201).json({ status: 'success', data: invoice });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };

  recordPayment = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      const { invoiceId, entityType, entityId, paymentDate, amount, paymentMethod, referenceNumber } = req.body;
      const organizationId = req.organizationId;
      const createdBy = req.user?.userId;

      const paymentNumber = generateId('PAY');

      const payment = await Payment.create({
        organizationId,
        paymentNumber,
        invoiceId,
        entityType,
        entityId,
        paymentDate,
        amount,
        paymentMethod,
        referenceNumber,
        createdBy,
      }, { transaction });

      if (invoiceId) {
        const invoice = await Invoice.findByPk(invoiceId);
        if (invoice) {
          // Update paid amount
          const currentPaid = parseFloat(invoice.paidAmount) || 0;
          invoice.paidAmount = (currentPaid + amount).toString();

          if (parseFloat(invoice.paidAmount) >= parseFloat(invoice.totalAmount)) {
            invoice.status = 'paid';
          } else {
            invoice.status = 'partially_paid';
          }
          await invoice.save({ transaction });

          // Create Allocation
          await PaymentAllocation.create({
            paymentId: payment.paymentId,
            invoiceId: invoice.invoiceId,
            allocatedAmount: amount,
          }, { transaction });
        }
      }

      await transaction.commit();
      res.status(201).json({ status: 'success', data: payment });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };
}

export const invoiceController = new FinanceController(Invoice);
export const paymentController = new FinanceController(Payment);
