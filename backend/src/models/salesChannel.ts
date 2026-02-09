import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class SalesChannel extends Model {
  declare channelId: number;
  declare organizationId: number;
  declare channelName: string;
  declare channelType: string;
  declare description: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initSalesChannel(sequelize: Sequelize): void {
  SalesChannel.init(
    {
      channelId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      channelName: { type: DataTypes.STRING(200), allowNull: false },
      channelType: { type: DataTypes.STRING(50), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { sequelize, modelName: 'SalesChannel', tableName: 'sales_channels', indexes: [{ fields: ['organization_id'] }, { fields: ['is_active'] }] }
  );
}
