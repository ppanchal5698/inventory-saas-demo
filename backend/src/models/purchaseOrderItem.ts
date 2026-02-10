import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

/** line_total is generated column; add via post-sync-mysql.sql */
export class PurchaseOrderItem extends Model {
  declare poItemId: number;
  declare poId: number;
  declare productId: number;
  declare quantity: number;
  declare unitPrice: string;
  declare taxRateId: number | null;
  declare taxAmount: string;
  declare discount: string;
  declare receivedQuantity: number;
  declare lineTotal: string; // Generated column
  declare notes: string | null;
}

export function initPurchaseOrderItem(sequelize: Sequelize): void {
  PurchaseOrderItem.init(
    {
      poItemId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      poId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'purchase_orders', key: 'po_id' } },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      taxRateId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'tax_rates', key: 'tax_rate_id' } },
      taxAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      receivedQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      lineTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: true }, // Generated Column
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'PurchaseOrderItem',
      tableName: 'purchase_order_items',
      timestamps: false,
      indexes: [{ fields: ['po_id'] }, { fields: ['product_id'] }],
    }
  );
}
