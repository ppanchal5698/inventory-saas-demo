import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Permission extends Model {
  declare permissionId: number;
  declare permissionName: string;
  declare module: string;
  declare action: string;
  declare description: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initPermission(sequelize: Sequelize): void {
  Permission.init(
    {
      permissionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      permissionName: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      module: { type: DataTypes.STRING(50), allowNull: false },
      action: { type: DataTypes.STRING(50), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'permissions',
      indexes: [{ fields: ['module'] }],
    }
  );
}
