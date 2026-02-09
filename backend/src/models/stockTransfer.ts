import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class StockTransfer extends Model {
  declare transferId: number;
  declare organizationId: number;
  declare transferNumber: string;
  declare fromWarehouseId: number;
  declare toWarehouseId: number;
  declare transferDate: Date;
  declare expectedReceiptDate: Date | null;
  declare actualReceiptDate: Date | null;
  declare status: string;
  declare shippingMethod: string | null;
  declare trackingNumber: string | null;
  declare notes: string | null;
  declare createdBy: number | null;
  declare approvedBy: number | null;
  declare receivedBy: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initStockTransfer(sequelize: Sequelize): void {
  StockTransfer.init(
    {
      transferId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      transferNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      fromWarehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'warehouses', key: 'warehouse_id' },
      },
      toWarehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'warehouses', key: 'warehouse_id' },
      },
      transferDate: { type: DataTypes.DATEONLY, allowNull: false },
      expectedReceiptDate: { type: DataTypes.DATEONLY, allowNull: true },
      actualReceiptDate: { type: DataTypes.DATEONLY, allowNull: true },
      status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'draft' },
      shippingMethod: { type: DataTypes.STRING(100), allowNull: true },
      trackingNumber: { type: DataTypes.STRING(100), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      approvedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      receivedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
    },
    {
      sequelize,
      modelName: 'StockTransfer',
      tableName: 'stock_transfers',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['from_warehouse_id'] },
        { fields: ['to_warehouse_id'] },
        { fields: ['status'] },
        { fields: ['transfer_date'] },
      ],
    }
  );
}
