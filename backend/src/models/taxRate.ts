import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class TaxRate extends Model {
  declare taxRateId: number;
  declare organizationId: number;
  declare taxName: string;
  declare taxType: 'vat' | 'gst' | 'sales_tax' | 'excise' | 'custom';
  declare rate: string;
  declare countryId: number | null;
  declare stateId: number | null;
  declare isCompound: boolean;
  declare priority: number;
  declare effectiveFrom: Date;
  declare effectiveTo: Date | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initTaxRate(sequelize: Sequelize): void {
  TaxRate.init(
    {
      taxRateId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      taxName: { type: DataTypes.STRING(100), allowNull: false },
      taxType: {
        type: DataTypes.ENUM('vat', 'gst', 'sales_tax', 'excise', 'custom'),
        allowNull: false,
      },
      rate: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
      countryId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'countries', key: 'country_id' } },
      stateId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'states', key: 'state_id' } },
      isCompound: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      priority: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      effectiveFrom: { type: DataTypes.DATEONLY, allowNull: false },
      effectiveTo: { type: DataTypes.DATEONLY, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'TaxRate',
      tableName: 'tax_rates',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['is_active'] },
        { fields: ['effective_from', 'effective_to'] },
      ],
    }
  );
}
