import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Supplier extends Model {
  declare supplierId: number;
  declare organizationId: number;
  declare supplierCode: string;
  declare supplierName: string;
  declare contactPerson: string | null;
  declare email: string | null;
  declare phone: string | null;
  declare alternatePhone: string | null;
  declare website: string | null;
  declare address: string | null;
  declare cityId: number | null;
  declare postalCode: string | null;
  declare taxId: string | null;
  declare registrationNumber: string | null;
  declare paymentTerms: string | null;
  declare creditLimit: string | null;
  declare creditDays: number;
  declare rating: string | null;
  declare preferredPaymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'cheque' | 'upi' | 'wallet' | null;
  declare bankDetails: unknown;
  declare isActive: boolean;
  declare tags: unknown;
  declare notes: string | null;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initSupplier(sequelize: Sequelize): void {
  Supplier.init(
    {
      supplierId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      supplierCode: { type: DataTypes.STRING(50), allowNull: false },
      supplierName: { type: DataTypes.STRING(255), allowNull: false },
      contactPerson: { type: DataTypes.STRING(200), allowNull: true },
      email: { type: DataTypes.STRING(255), allowNull: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      alternatePhone: { type: DataTypes.STRING(20), allowNull: true },
      website: { type: DataTypes.STRING(255), allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      cityId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'cities', key: 'city_id' } },
      postalCode: { type: DataTypes.STRING(20), allowNull: true },
      taxId: { type: DataTypes.STRING(50), allowNull: true },
      registrationNumber: { type: DataTypes.STRING(50), allowNull: true },
      paymentTerms: { type: DataTypes.STRING(100), allowNull: true },
      creditLimit: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      creditDays: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      rating: { type: DataTypes.DECIMAL(3, 2), allowNull: true },
      preferredPaymentMethod: { type: DataTypes.ENUM('cash', 'credit_card', 'bank_transfer', 'cheque', 'upi', 'wallet'), allowNull: true },
      bankDetails: { type: DataTypes.JSON, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      tags: { type: DataTypes.JSON, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'suppliers',
      paranoid: true,
      indexes: [
        { unique: true, fields: ['organization_id', 'supplier_code'] },
        { fields: ['organization_id'] },
        { fields: ['email'] },
        { fields: ['phone'] },
        { fields: ['is_active'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
