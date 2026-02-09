import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Subscription extends Model {
  declare subscriptionId: number;
  declare organizationId: number;
  declare planId: number;
  declare status: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'unpaid' | 'expired';
  declare currentPeriodStart: Date;
  declare currentPeriodEnd: Date;
  declare trialStart: Date | null;
  declare trialEnd: Date | null;
  declare cancelledAt: Date | null;
  declare cancelAtPeriodEnd: boolean | null;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initSubscription(sequelize: Sequelize): void {
  Subscription.init(
    {
      subscriptionId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      planId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'subscription_plans', key: 'plan_id' } },
      status: {
        type: DataTypes.ENUM('trialing', 'active', 'past_due', 'cancelled', 'unpaid', 'expired'),
        allowNull: false,
        defaultValue: 'trialing',
      },
      currentPeriodStart: { type: DataTypes.DATE, allowNull: false },
      currentPeriodEnd: { type: DataTypes.DATE, allowNull: false },
      trialStart: { type: DataTypes.DATE, allowNull: true },
      trialEnd: { type: DataTypes.DATE, allowNull: true },
      cancelledAt: { type: DataTypes.DATE, allowNull: true },
      cancelAtPeriodEnd: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      metadata: { type: DataTypes.JSON, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Subscription',
      tableName: 'subscriptions',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['plan_id'] },
        { fields: ['status'] },
      ],
    }
  );
}
