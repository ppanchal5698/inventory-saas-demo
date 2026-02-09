import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class SubscriptionPlan extends Model {
  declare planId: number;
  declare planName: string;
  declare slug: string;
  declare description: string | null;
  declare price: string;
  declare billingInterval: 'monthly' | 'quarterly' | 'yearly';
  declare features: unknown;
  declare trialDays: number;
  declare isActive: boolean;
  declare displayOrder: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initSubscriptionPlan(sequelize: Sequelize): void {
  SubscriptionPlan.init(
    {
      planId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      planName: { type: DataTypes.STRING(200), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      billingInterval: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
        allowNull: false,
        defaultValue: 'monthly',
      },
      features: { type: DataTypes.JSON, allowNull: true },
      trialDays: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 14 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      displayOrder: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'SubscriptionPlan',
      tableName: 'subscription_plans',
      indexes: [{ fields: ['is_active'] }],
    }
  );
}
