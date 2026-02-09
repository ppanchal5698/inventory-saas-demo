import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Customer extends Model {
  declare customerId: number;
  declare organizationId: number;
  declare customerCode: string;
  declare customerName: string;
  declare customerGroupId: number | null;
  declare contactPerson: string | null;
  declare email: string | null;
  declare phone: string | null;
  declare alternatePhone: string | null;
  declare billingAddress: string | null;
  declare billingCityId: number | null;
  declare billingPostalCode: string | null;
  declare shippingAddress: string | null;
  declare shippingCityId: number | null;
  declare shippingPostalCode: string | null;
  declare taxId: string | null;
  declare creditLimit: string | null;
  declare creditDays: number;
  declare totalOutstanding: string;
  declare rating: string | null;
  declare preferredPaymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'cheque' | 'upi' | 'wallet' | null;
  declare loyaltyPoints: number;
  declare isActive: boolean;
  declare tags: unknown;
  declare notes: string | null;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initCustomer(sequelize: Sequelize): void {
  Customer.init(
    {
      customerId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      customerCode: { type: DataTypes.STRING(50), allowNull: false },
      customerName: { type: DataTypes.STRING(255), allowNull: false },
      customerGroupId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'customer_groups', key: 'group_id' } },
      contactPerson: { type: DataTypes.STRING(200), allowNull: true },
      email: { type: DataTypes.STRING(255), allowNull: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      alternatePhone: { type: DataTypes.STRING(20), allowNull: true },
      billingAddress: { type: DataTypes.TEXT, allowNull: true },
      billingCityId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'cities', key: 'city_id' } },
      billingPostalCode: { type: DataTypes.STRING(20), allowNull: true },
      shippingAddress: { type: DataTypes.TEXT, allowNull: true },
      shippingCityId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'cities', key: 'city_id' } },
      shippingPostalCode: { type: DataTypes.STRING(20), allowNull: true },
      taxId: { type: DataTypes.STRING(50), allowNull: true },
      creditLimit: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      creditDays: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      totalOutstanding: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      rating: { type: DataTypes.DECIMAL(3, 2), allowNull: true },
      preferredPaymentMethod: { type: DataTypes.ENUM('cash', 'credit_card', 'bank_transfer', 'cheque', 'upi', 'wallet'), allowNull: true },
      loyaltyPoints: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      tags: { type: DataTypes.JSON, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Customer',
      tableName: 'customers',
      paranoid: true,
      indexes: [
        { unique: true, fields: ['organization_id', 'customer_code'] },
        { fields: ['organization_id'] },
        { fields: ['customer_group_id'] },
        { fields: ['email'] },
        { fields: ['phone'] },
        { fields: ['is_active'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
