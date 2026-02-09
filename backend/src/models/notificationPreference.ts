import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class NotificationPreference extends Model {
  declare preferenceId: number;
  declare userId: number;
  declare notificationType: 'order_updates' | 'inventory_alerts' | 'payment_reminders' | 'system_alerts' | 'marketing' | 'security';
  declare inAppEnabled: boolean;
  declare emailEnabled: boolean;
  declare smsEnabled: boolean;
  declare pushEnabled: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initNotificationPreference(sequelize: Sequelize): void {
  NotificationPreference.init(
    {
      preferenceId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' } },
      notificationType: {
        type: DataTypes.ENUM('order_updates', 'inventory_alerts', 'payment_reminders', 'system_alerts', 'marketing', 'security'),
        allowNull: false,
      },
      inAppEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      emailEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      smsEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      pushEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'NotificationPreference',
      tableName: 'notification_preferences',
      indexes: [
        { unique: true, fields: ['user_id', 'notification_type'] },
        { fields: ['user_id'] },
      ],
    }
  );
}
