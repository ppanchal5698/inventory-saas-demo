import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Session extends Model {
  declare sessionId: number;
  declare userId: number;
  declare sessionToken: string;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare deviceInfo: unknown;
  declare expiresAt: Date;
  declare lastActivityAt: Date;
  declare createdAt: Date;
}

export function initSession(sequelize: Sequelize): void {
  Session.init(
    {
      sessionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' } },
      sessionToken: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      ipAddress: { type: DataTypes.STRING(45), allowNull: true },
      userAgent: { type: DataTypes.TEXT, allowNull: true },
      deviceInfo: { type: DataTypes.JSON, allowNull: true },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      lastActivityAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['expires_at'] },
      ],
    }
  );
}
