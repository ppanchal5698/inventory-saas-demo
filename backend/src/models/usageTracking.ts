import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class UsageTracking extends Model {
  declare usageId: number;
  declare organizationId: number;
  declare period: Date;
  declare metricName: string;
  declare currentValue: number;
  declare limitValue: number | null;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initUsageTracking(sequelize: Sequelize): void {
  UsageTracking.init(
    {
      usageId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      period: { type: DataTypes.DATEONLY, allowNull: false },
      metricName: { type: DataTypes.STRING(100), allowNull: false },
      currentValue: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      limitValue: { type: DataTypes.INTEGER, allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
    },
    {
      sequelize,
      modelName: 'UsageTracking',
      tableName: 'usage_tracking',
      indexes: [
        { unique: true, fields: ['organization_id', 'period', 'metric_name'] },
        { fields: ['organization_id'] },
        { fields: ['period'] },
      ],
    }
  );
}
