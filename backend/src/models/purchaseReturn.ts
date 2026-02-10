import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PurchaseReturn extends Model {
  declare returnId: number;
  declare organizationId: number;
  declare returnNumber: string;
  declare poId: number | null;
  declare supplierId: number;
  declare warehouseId: number;
  declare returnDate: Date;
  declare status: 'requested' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  declare totalAmount: string | null;
  declare refundedAmount: string;
  declare reason: string | null;
  declare notes: string | null;
  declare createdBy: number | null;
  declare approvedBy: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initPurchaseReturn(sequelize: Sequelize): void {
  PurchaseReturn.init(
    {
      returnId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      returnNumber: { type: DataTypes.STRING(50), allowNull: false },
      poId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'purchase_orders', key: 'po_id' } },
      supplierId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'suppliers', key: 'supplier_id' } },
      warehouseId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'warehouses', key: 'warehouse_id' } },
      returnDate: { type: DataTypes.DATEONLY, allowNull: false },
      status: {
        type: DataTypes.ENUM('requested', 'approved', 'rejected', 'processing', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'requested',
      },
      totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      refundedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      reason: { type: DataTypes.TEXT, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      approvedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
    },
    {
      sequelize,
      modelName: 'PurchaseReturn',
      tableName: 'purchase_returns',
      indexes: [
        { unique: true, fields: ['organization_id', 'return_number'] },
        { fields: ['organization_id'] },
        { fields: ['po_id'] },
        { fields: ['supplier_id'] },
        { fields: ['status'] },
      ],
    }
  );
}
