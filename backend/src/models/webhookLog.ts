import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class WebhookLog extends Model {
  declare logId: number;
  declare webhookId: number;
  declare event: string;
  declare payload: unknown;
  declare responseStatus: number | null;
  declare responseBody: string | null;
  declare errorMessage: string | null;
  declare attemptCount: number;
  declare createdAt: Date;
}

export function initWebhookLog(sequelize: Sequelize): void {
  WebhookLog.init(
    {
      logId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      webhookId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'webhooks', key: 'webhook_id' } },
      event: { type: DataTypes.STRING(100), allowNull: false },
      payload: { type: DataTypes.JSON, allowNull: true },
      responseStatus: { type: DataTypes.INTEGER, allowNull: true },
      responseBody: { type: DataTypes.TEXT, allowNull: true },
      errorMessage: { type: DataTypes.TEXT, allowNull: true },
      attemptCount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: 'WebhookLog',
      tableName: 'webhook_logs',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['webhook_id'] },
        { fields: ['event'] },
        { fields: ['created_at'] },
      ],
    }
  );
}
