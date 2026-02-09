import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class SavedReport extends Model {
  declare reportId: number;
  declare organizationId: number;
  declare reportName: string;
  declare reportType: 'sales' | 'inventory' | 'financial' | 'custom' | 'analytics';
  declare description: string | null;
  declare configuration: unknown;
  declare createdBy: number | null;
  declare isPublic: boolean | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initSavedReport(sequelize: Sequelize): void {
  SavedReport.init(
    {
      reportId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      reportName: { type: DataTypes.STRING(200), allowNull: false },
      reportType: {
        type: DataTypes.ENUM('sales', 'inventory', 'financial', 'custom', 'analytics'),
        allowNull: false,
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      configuration: { type: DataTypes.JSON, allowNull: false },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      isPublic: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'SavedReport',
      tableName: 'saved_reports',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['report_type'] },
        { fields: ['created_by'] },
      ],
    }
  );
}
