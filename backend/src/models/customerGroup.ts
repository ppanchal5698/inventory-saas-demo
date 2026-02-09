import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class CustomerGroup extends Model {
  declare groupId: number;
  declare organizationId: number;
  declare groupName: string;
  declare description: string | null;
  declare discountPercentage: string;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initCustomerGroup(sequelize: Sequelize): void {
  CustomerGroup.init(
    {
      groupId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      groupName: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      discountPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { sequelize, modelName: 'CustomerGroup', tableName: 'customer_groups', indexes: [{ fields: ['organization_id'] }, { fields: ['is_active'] }] }
  );
}
