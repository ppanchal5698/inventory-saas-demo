import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Role extends Model {
  declare roleId: number;
  declare organizationId: number;
  declare roleName: string;
  declare description: string | null;
  declare isSystem: boolean;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initRole(sequelize: Sequelize): void {
  Role.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      roleName: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      isSystem: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['is_active'] },
        { unique: true, fields: ['organization_id', 'role_name'] },
      ],
    }
  );
}
