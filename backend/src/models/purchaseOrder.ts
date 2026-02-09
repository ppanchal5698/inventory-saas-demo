import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PurchaseOrder extends Model {
  declare poId: number;
  declare organizationId: number;
  declare poNumber: string;
  declare supplierId: number;
  declare warehouseId: number;
  declare orderDate: Date;
  declare expectedDeliveryDate: Date | null;
  declare actualDeliveryDate: Date | null;
  declare status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'partially_received' | 'received' | 'closed' | 'cancelled';
  declare subtotal: string;
  declare taxAmount: string;
  declare shippingCost: string;
  declare discount: string;
  declare totalAmount: string;
  declare paidAmount: string;
  declare paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'overpaid' | 'refunded';
  declare currency: string;
  declare exchangeRate: string;
  declare paymentTerms: string | null;
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

export function initPurchaseOrder(sequelize: Sequelize): void {
  PurchaseOrder.init(
    {
      poId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      poNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      supplierId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'suppliers', key: 'supplier_id' } },
      warehouseId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'warehouses', key: 'warehouse_id' } },
      orderDate: { type: DataTypes.DATEONLY, allowNull: false },
      expectedDeliveryDate: { type: DataTypes.DATEONLY, allowNull: true },
      actualDeliveryDate: { type: DataTypes.DATEONLY, allowNull: true },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected', 'partially_received', 'received', 'closed', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
      },
      subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      taxAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      shippingCost: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      paidAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid', 'overpaid', 'refunded'),
        allowNull: false,
        defaultValue: 'unpaid',
      },
      currency: { type: DataTypes.STRING(10), allowNull: true, defaultValue: 'USD' },
      exchangeRate: { type: DataTypes.DECIMAL(10, 4), allowNull: true, defaultValue: 1 },
      paymentTerms: { type: DataTypes.STRING(100), allowNull: true },
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
      modelName: 'PurchaseOrder',
      tableName: 'purchase_orders',
      paranoid: true,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['supplier_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['status'] },
        { fields: ['payment_status'] },
        { fields: ['order_date'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
