import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PurchaseReturnItem extends Model {
  declare returnItemId: number;
  declare returnId: number;
  declare productId: number;
  declare batchId: number | null;
  declare quantity: number;
  declare unitPrice: string;
  declare reason: string | null;
  declare condition: string | null;
}

export function initPurchaseReturnItem(sequelize: Sequelize): void {
  PurchaseReturnItem.init(
    {
      returnItemId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      returnId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'purchase_returns', key: 'return_id' } },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      batchId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'batches', key: 'batch_id' } },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      reason: { type: DataTypes.TEXT, allowNull: true },
      condition: { type: DataTypes.STRING(50), allowNull: true },
    },
    {
      sequelize,
      modelName: 'PurchaseReturnItem',
      tableName: 'purchase_return_items',
      timestamps: false,
      indexes: [{ fields: ['return_id'] }, { fields: ['product_id'] }],
    }
  );
}
