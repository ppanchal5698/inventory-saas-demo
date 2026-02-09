import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class TaxExemption extends Model {
  declare exemptionId: number;
  declare organizationId: number;
  declare entityType: string;
  declare entityId: number;
  declare taxRateId: number | null;
  declare exemptionCertificate: string | null;
  declare validFrom: Date;
  declare validTo: Date | null;
  declare notes: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initTaxExemption(sequelize: Sequelize): void {
  TaxExemption.init(
    {
      exemptionId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      entityType: { type: DataTypes.STRING(50), allowNull: false },
      entityId: { type: DataTypes.INTEGER, allowNull: false },
      taxRateId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'tax_rates', key: 'tax_rate_id' } },
      exemptionCertificate: { type: DataTypes.STRING(100), allowNull: true },
      validFrom: { type: DataTypes.DATEONLY, allowNull: false },
      validTo: { type: DataTypes.DATEONLY, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'TaxExemption',
      tableName: 'tax_exemptions',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['entity_type', 'entity_id'] },
        { fields: ['valid_from', 'valid_to'] },
      ],
    }
  );
}
