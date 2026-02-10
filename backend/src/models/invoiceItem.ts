import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

/** line_total is generated column; add via post-sync-mysql.sql */
export class InvoiceItem extends Model {
  declare invoiceItemId: number;
  declare invoiceId: number;
  declare productId: number | null;
  declare description: string;
  declare quantity: number;
  declare unitPrice: string;
  declare taxRateId: number | null;
  declare taxAmount: string;
  declare discount: string;
  declare lineTotal: string; // Generated column
}

export function initInvoiceItem(sequelize: Sequelize): void {
  InvoiceItem.init(
    {
      invoiceItemId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      invoiceId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'invoices', key: 'invoice_id' } },
      productId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'products', key: 'product_id' } },
      description: { type: DataTypes.TEXT, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      taxRateId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'tax_rates', key: 'tax_rate_id' } },
      taxAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      lineTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: true }, // Generated Column
    },
    {
      sequelize,
      modelName: 'InvoiceItem',
      tableName: 'invoice_items',
      timestamps: false,
      indexes: [{ fields: ['invoice_id'] }, { fields: ['product_id'] }],
    }
  );
}
