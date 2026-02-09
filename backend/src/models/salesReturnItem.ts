import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class SalesReturnItem extends Model {
  declare returnItemId: number;
  declare returnId: number;
  declare orderItemId: number | null;
  declare productId: number;
  declare batchId: number | null;
  declare serialNumberId: number | null;
  declare quantity: number;
  declare unitPrice: string;
  declare refundAmount: string | null;
  declare reason: string | null;
  declare condition: string | null;
  declare action: string | null;
}

export function initSalesReturnItem(sequelize: Sequelize): void {
  SalesReturnItem.init(
    {
      returnItemId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      returnId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'sales_returns', key: 'return_id' } },
      orderItemId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'sales_order_items', key: 'order_item_id' } },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      batchId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'batches', key: 'batch_id' } },
      serialNumberId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'serial_numbers', key: 'serial_id' } },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      refundAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      reason: { type: DataTypes.TEXT, allowNull: true },
      condition: { type: DataTypes.STRING(50), allowNull: true },
      action: { type: DataTypes.STRING(50), allowNull: true },
    },
    {
      sequelize,
      modelName: 'SalesReturnItem',
      tableName: 'sales_return_items',
      timestamps: false,
      indexes: [{ fields: ['return_id'] }, { fields: ['product_id'] }],
    }
  );
}
