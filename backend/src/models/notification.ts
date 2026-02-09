import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Notification extends Model {
  declare notificationId: number;
  declare userId: number;
  declare organizationId: number | null;
  declare type: 'order_updates' | 'inventory_alerts' | 'payment_reminders' | 'system_alerts' | 'marketing' | 'security';
  declare channel: 'in_app' | 'email' | 'sms' | 'push';
  declare priority: 'low' | 'medium' | 'high' | 'urgent';
  declare title: string;
  declare message: string;
  declare actionUrl: string | null;
  declare metadata: unknown;
  declare isRead: boolean;
  declare readAt: Date | null;
  declare sentAt: Date | null;
  declare expiresAt: Date | null;
  declare createdAt: Date;
}

export function initNotification(sequelize: Sequelize): void {
  Notification.init(
    {
      notificationId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' } },
      organizationId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'organizations', key: 'organization_id' } },
      type: {
        type: DataTypes.ENUM('order_updates', 'inventory_alerts', 'payment_reminders', 'system_alerts', 'marketing', 'security'),
        allowNull: false,
      },
      channel: {
        type: DataTypes.ENUM('in_app', 'email', 'sms', 'push'),
        allowNull: false,
        defaultValue: 'in_app',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium',
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      actionUrl: { type: DataTypes.TEXT, allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      readAt: { type: DataTypes.DATE, allowNull: true },
      sentAt: { type: DataTypes.DATE, allowNull: true },
      expiresAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notifications',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['organization_id'] },
        { fields: ['is_read'] },
        { fields: ['type'] },
        { fields: ['created_at'] },
      ],
    }
  );
}
