import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PasswordResetToken extends Model {
  declare tokenId: number;
  declare userId: number;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare usedAt: Date | null;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare createdAt: Date;
}

export function initPasswordResetToken(sequelize: Sequelize): void {
  PasswordResetToken.init(
    {
      tokenId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' } },
      tokenHash: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      usedAt: { type: DataTypes.DATE, allowNull: true },
      ipAddress: { type: DataTypes.STRING(45), allowNull: true },
      userAgent: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'PasswordResetToken',
      tableName: 'password_reset_tokens',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['expires_at'] },
      ],
    }
  );
}
