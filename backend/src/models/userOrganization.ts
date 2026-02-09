import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class UserOrganization extends Model {
  declare userOrgId: number;
  declare userId: number;
  declare organizationId: number;
  declare roleId: number | null;
  declare isDefault: boolean;
  declare invitedBy: number | null;
  declare invitedAt: Date | null;
  declare joinedAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initUserOrganization(sequelize: Sequelize): void {
  UserOrganization.init(
    {
      userOrgId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' } },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      roleId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'roles', key: 'role_id' } },
      isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      invitedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      invitedAt: { type: DataTypes.DATE, allowNull: true },
      joinedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'UserOrganization',
      tableName: 'user_organizations',
      indexes: [
        { unique: true, fields: ['user_id', 'organization_id'] },
        { fields: ['user_id'] },
        { fields: ['organization_id'] },
        { fields: ['role_id'] },
      ],
    }
  );
}
