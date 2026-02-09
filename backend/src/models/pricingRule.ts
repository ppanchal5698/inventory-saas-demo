import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PricingRule extends Model {
  declare ruleId: number;
  declare organizationId: number;
  declare ruleName: string;
  declare ruleType: 'volume' | 'customer' | 'product' | 'category' | 'promotional' | 'seasonal';
  declare applicableOn: string;
  declare entityId: number | null;
  declare minQuantity: number | null;
  declare maxQuantity: number | null;
  declare discountType: string;
  declare discountValue: string;
  declare priority: number;
  declare validFrom: Date;
  declare validTo: Date | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initPricingRule(sequelize: Sequelize): void {
  PricingRule.init(
    {
      ruleId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      ruleName: { type: DataTypes.STRING(200), allowNull: false },
      ruleType: {
        type: DataTypes.ENUM('volume', 'customer', 'product', 'category', 'promotional', 'seasonal'),
        allowNull: false,
      },
      applicableOn: { type: DataTypes.STRING(50), allowNull: false },
      entityId: { type: DataTypes.INTEGER, allowNull: true },
      minQuantity: { type: DataTypes.INTEGER, allowNull: true },
      maxQuantity: { type: DataTypes.INTEGER, allowNull: true },
      discountType: { type: DataTypes.STRING(50), allowNull: false },
      discountValue: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      priority: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      validFrom: { type: DataTypes.DATEONLY, allowNull: false },
      validTo: { type: DataTypes.DATEONLY, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'PricingRule',
      tableName: 'pricing_rules',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['rule_type'] },
        { fields: ['valid_from', 'valid_to'] },
        { fields: ['is_active'] },
      ],
    }
  );
}
