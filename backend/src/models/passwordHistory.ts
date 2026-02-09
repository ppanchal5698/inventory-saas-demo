import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PasswordHistory extends Model {
  declare historyId: number;
  declare userId: number;
  declare passwordHash: string;
  declare createdAt: Date;
}

export function initPasswordHistory(sequelize: Sequelize): void {
  PasswordHistory.init(
    {
      historyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' } },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      sequelize,
      modelName: 'PasswordHistory',
      tableName: 'password_history',
      timestamps: true,
      updatedAt: false,
      indexes: [{ fields: ['user_id'] }],
    }
  );
}
