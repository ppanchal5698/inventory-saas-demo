import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class SalesReturn extends Model {
  declare returnId: number;
  declare organizationId: number;
  declare returnNumber: string;
  declare orderId: number | null;
  declare customerId: number;
  declare warehouseId: number;
  declare returnDate: Date;
  declare status: 'requested' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  declare totalAmount: string | null;
  declare refundedAmount: string;
  declare restockingFee: string;
  declare reason: string | null;
  declare notes: string | null;
  declare createdBy: number | null;
  declare approvedBy: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initSalesReturn(sequelize: Sequelize): void {
  SalesReturn.init(
    {
      returnId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      returnNumber: { type: DataTypes.STRING(50), allowNull: false },
      orderId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'sales_orders', key: 'order_id' } },
      customerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'customers', key: 'customer_id' } },
      warehouseId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'warehouses', key: 'warehouse_id' } },
      returnDate: { type: DataTypes.DATEONLY, allowNull: false },
      status: {
        type: DataTypes.ENUM('requested', 'approved', 'rejected', 'processing', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'requested',
      },
      totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      refundedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      restockingFee: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      reason: { type: DataTypes.TEXT, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      approvedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
    },
    {
      sequelize,
      modelName: 'SalesReturn',
      tableName: 'sales_returns',
      indexes: [
        { unique: true, fields: ['organization_id', 'return_number'] },
        { fields: ['organization_id'] },
        { fields: ['order_id'] },
        { fields: ['customer_id'] },
        { fields: ['status'] },
        { fields: ['return_date'] },
      ],
    }
  );
}
