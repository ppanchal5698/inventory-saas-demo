import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

/** line_total is generated column; add via post-sync-mysql.sql */
export class SalesOrderItem extends Model {
  declare orderItemId: number;
  declare orderId: number;
  declare productId: number;
  declare batchId: number | null;
  declare serialNumberId: number | null;
  declare quantity: number;
  declare unitPrice: string;
  declare taxRateId: number | null;
  declare taxAmount: string;
  declare discount: string;
  declare fulfilledQuantity: number;
  declare lineTotal: string; // Generated column
  declare notes: string | null;
}

export function initSalesOrderItem(sequelize: Sequelize): void {
  SalesOrderItem.init(
    {
      orderItemId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'sales_orders', key: 'order_id' } },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      batchId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'batches', key: 'batch_id' } },
      serialNumberId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'serial_numbers', key: 'serial_id' } },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      taxRateId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'tax_rates', key: 'tax_rate_id' } },
      taxAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      fulfilledQuantity: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      lineTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: true }, // Generated Column
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'SalesOrderItem',
      tableName: 'sales_order_items',
      timestamps: false,
      indexes: [{ fields: ['order_id'] }, { fields: ['product_id'] }],
    }
  );
}
