import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class SalesOrder extends Model {
  declare orderId: number;
  declare organizationId: number;
  declare orderNumber: string;
  declare customerId: number;
  declare warehouseId: number;
  declare orderDate: Date;
  declare expectedDeliveryDate: Date | null;
  declare actualDeliveryDate: Date | null;
  declare status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'on_hold';
  declare subtotal: string;
  declare taxAmount: string;
  declare shippingCost: string;
  declare discountAmount: string;
  declare totalAmount: string;
  declare paidAmount: string;
  declare paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'overpaid' | 'refunded';
  declare currency: string;
  declare shippingAddress: string | null;
  declare billingAddress: string | null;
  declare customerPo: string | null;
  declare salesChannelId: number | null;
  declare notes: string | null;
  declare internalNotes: string | null;
  declare attachments: unknown;
  declare createdBy: number | null;
  declare approvedBy: number | null;
  declare approvedAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initSalesOrder(sequelize: Sequelize): void {
  SalesOrder.init(
    {
      orderId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      orderNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      customerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'customers', key: 'customer_id' } },
      warehouseId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'warehouses', key: 'warehouse_id' } },
      orderDate: { type: DataTypes.DATEONLY, allowNull: false },
      expectedDeliveryDate: { type: DataTypes.DATEONLY, allowNull: true },
      actualDeliveryDate: { type: DataTypes.DATEONLY, allowNull: true },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'on_hold'),
        allowNull: false,
        defaultValue: 'pending',
      },
      subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      taxAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      shippingCost: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      discountAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      paidAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid', 'overpaid', 'refunded'),
        allowNull: false,
        defaultValue: 'unpaid',
      },
      currency: { type: DataTypes.STRING(10), allowNull: true, defaultValue: 'USD' },
      shippingAddress: { type: DataTypes.TEXT, allowNull: true },
      billingAddress: { type: DataTypes.TEXT, allowNull: true },
      customerPo: { type: DataTypes.STRING(100), allowNull: true },
      salesChannelId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'sales_channels', key: 'channel_id' } },
      notes: { type: DataTypes.TEXT, allowNull: true },
      internalNotes: { type: DataTypes.TEXT, allowNull: true },
      attachments: { type: DataTypes.JSON, allowNull: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      approvedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      approvedAt: { type: DataTypes.DATE, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'SalesOrder',
      tableName: 'sales_orders',
      paranoid: true,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['customer_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['status'] },
        { fields: ['payment_status'] },
        { fields: ['order_date'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
