import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class LoginHistory extends Model {
  declare historyId: number;
  declare userId: number | null;
  declare email: string;
  declare success: boolean;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare location: unknown;
  declare failureReason: string | null;
  declare createdAt: Date;
}

export function initLoginHistory(sequelize: Sequelize): void {
  LoginHistory.init(
    {
      historyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      email: { type: DataTypes.STRING(255), allowNull: false },
      success: { type: DataTypes.BOOLEAN, allowNull: false },
      ipAddress: { type: DataTypes.STRING(45), allowNull: true },
      userAgent: { type: DataTypes.TEXT, allowNull: true },
      location: { type: DataTypes.JSON, allowNull: true },
      failureReason: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      sequelize,
      modelName: 'LoginHistory',
      tableName: 'login_history',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['email'] },
        { fields: ['created_at'] },
        { fields: ['success'] },
      ],
    }
  );
}
