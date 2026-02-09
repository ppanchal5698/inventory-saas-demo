import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class DashboardWidget extends Model {
  declare widgetId: number;
  declare organizationId: number;
  declare userId: number | null;
  declare widgetType: string;
  declare title: string;
  declare configuration: unknown;
  declare position: unknown;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initDashboardWidget(sequelize: Sequelize): void {
  DashboardWidget.init(
    {
      widgetId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      widgetType: { type: DataTypes.STRING(100), allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      configuration: { type: DataTypes.JSON, allowNull: false },
      position: { type: DataTypes.JSON, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'DashboardWidget',
      tableName: 'dashboard_widgets',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['user_id'] },
        { fields: ['widget_type'] },
      ],
    }
  );
}
