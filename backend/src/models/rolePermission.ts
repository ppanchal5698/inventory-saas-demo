import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class RolePermission extends Model {
  declare rolePermissionId: number;
  declare roleId: number;
  declare permissionId: number;
  declare createdAt: Date;
}

export function initRolePermission(sequelize: Sequelize): void {
  RolePermission.init(
    {
      rolePermissionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'roles', key: 'role_id' } },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'permissions', key: 'permission_id' },
      },
    },
    {
      sequelize,
      modelName: 'RolePermission',
      tableName: 'role_permissions',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { unique: true, fields: ['role_id', 'permission_id'] },
        { fields: ['role_id'] },
        { fields: ['permission_id'] },
      ],
    }
  );
}
