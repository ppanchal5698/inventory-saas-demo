import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class InventoryTransaction extends Model {
  declare transactionId: number;
  declare organizationId: number;
  declare transactionType: 'receipt' | 'shipment' | 'adjustment' | 'transfer' | 'return' | 'damage' | 'expiry';
  declare productId: number;
  declare warehouseId: number;
  declare batchId: number | null;
  declare serialNumberId: number | null;
  declare quantity: number;
  declare unitCost: string | null;
  declare totalCost: string | null;
  declare referenceType: string | null;
  declare referenceId: number | null;
  declare transactionDate: Date;
  declare notes: string | null;
  declare performedBy: number | null;
}

export function initInventoryTransaction(sequelize: Sequelize): void {
  InventoryTransaction.init(
    {
      transactionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      transactionType: {
        type: DataTypes.ENUM('receipt', 'shipment', 'adjustment', 'transfer', 'return', 'damage', 'expiry'),
        allowNull: false,
      },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'warehouses', key: 'warehouse_id' },
      },
      batchId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'batches', key: 'batch_id' } },
      serialNumberId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'serial_numbers', key: 'serial_id' },
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unitCost: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      totalCost: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      referenceType: { type: DataTypes.STRING(50), allowNull: true },
      referenceId: { type: DataTypes.INTEGER, allowNull: true },
      transactionDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      notes: { type: DataTypes.TEXT, allowNull: true },
      performedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
    },
    {
      sequelize,
      modelName: 'InventoryTransaction',
      tableName: 'inventory_transactions',
      timestamps: false,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['product_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['transaction_type'] },
        { fields: ['transaction_date'] },
        { fields: ['reference_type', 'reference_id'] },
      ],
    }
  );
}
