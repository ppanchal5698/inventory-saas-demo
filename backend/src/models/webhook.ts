import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Webhook extends Model {
  declare webhookId: number;
  declare organizationId: number;
  declare webhookName: string;
  declare url: string;
  declare secret: string;
  declare events: unknown;
  declare headers: unknown;
  declare isActive: boolean;
  declare failureCount: number;
  declare lastTriggeredAt: Date | null;
  declare createdBy: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initWebhook(sequelize: Sequelize): void {
  Webhook.init(
    {
      webhookId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      webhookName: { type: DataTypes.STRING(200), allowNull: false },
      url: { type: DataTypes.TEXT, allowNull: false },
      secret: { type: DataTypes.STRING(255), allowNull: false },
      events: { type: DataTypes.JSON, allowNull: true },
      headers: { type: DataTypes.JSON, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      failureCount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      lastTriggeredAt: { type: DataTypes.DATE, allowNull: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
    },
    {
      sequelize,
      modelName: 'Webhook',
      tableName: 'webhooks',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['is_active'] },
      ],
    }
  );
}
