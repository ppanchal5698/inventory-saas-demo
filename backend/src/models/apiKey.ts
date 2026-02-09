import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class ApiKey extends Model {
  declare apiKeyId: number;
  declare organizationId: number;
  declare keyName: string;
  declare keyHash: string;
  declare keyPrefix: string;
  declare permissions: unknown;
  declare expiresAt: Date | null;
  declare lastUsedAt: Date | null;
  declare usageCount: number;
  declare isActive: boolean;
  declare createdBy: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initApiKey(sequelize: Sequelize): void {
  ApiKey.init(
    {
      apiKeyId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      keyName: { type: DataTypes.STRING(200), allowNull: false },
      keyHash: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      keyPrefix: { type: DataTypes.STRING(20), allowNull: false },
      permissions: { type: DataTypes.JSON, allowNull: true },
      expiresAt: { type: DataTypes.DATE, allowNull: true },
      lastUsedAt: { type: DataTypes.DATE, allowNull: true },
      usageCount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
    },
    {
      sequelize,
      modelName: 'ApiKey',
      tableName: 'api_keys',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['key_prefix'] },
        { fields: ['is_active'] },
      ],
    }
  );
}
