import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PasswordResetOtp extends Model {
  declare otpId: number;
  declare userId: number;
  declare codeHash: string;
  declare expiresAt: Date;
  declare usedAt: Date | null;
  declare sentCount: number;
  declare attemptCount: number;
  declare maxAttempts: number;
  declare lastSentAt: Date;
  declare ipAddress: string | null;
  declare createdAt: Date;
}

export function initPasswordResetOtp(sequelize: Sequelize): void {
  PasswordResetOtp.init(
    {
      otpId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' } },
      codeHash: { type: DataTypes.STRING(255), allowNull: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      usedAt: { type: DataTypes.DATE, allowNull: true },
      sentCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      attemptCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      maxAttempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
      lastSentAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      ipAddress: { type: DataTypes.STRING(45), allowNull: true },
    },
    {
      sequelize,
      modelName: 'PasswordResetOtp',
      tableName: 'password_reset_otps',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['expires_at'] },
      ],
    }
  );
}
