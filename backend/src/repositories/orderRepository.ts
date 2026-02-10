import { BaseRepository } from './baseRepository';
import { SalesOrder } from '../models/salesOrder';
import { SalesOrderItem } from '../models/salesOrderItem';
import { Transaction } from 'sequelize';

export class OrderRepository extends BaseRepository<SalesOrder> {
  constructor() {
    super(SalesOrder);
  }

  async createOrderItem(data: any, transaction?: Transaction) {
    return SalesOrderItem.create(data, { transaction });
  }
}

export const orderRepository = new OrderRepository();
