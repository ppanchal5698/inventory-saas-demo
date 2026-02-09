import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class AccountDeletionRequest extends Model {
  declare requestId: number;
  declare userId: number;
  declare confirmationTokenHash: string;
  declare reason: string | null;
  declare expiresAt: Date;
  declare confirmedAt: Date | null;
  declare processedAt: Date | null;
  declare createdAt: Date;
}

export function initAccountDeletionRequest(sequelize: Sequelize): void {
  AccountDeletionRequest.init(
    {
      requestId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' } },
      confirmationTokenHash: { type: DataTypes.STRING(255), allowNull: false },
      reason: { type: DataTypes.TEXT, allowNull: true },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      confirmedAt: { type: DataTypes.DATE, allowNull: true },
      processedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'AccountDeletionRequest',
      tableName: 'account_deletion_requests',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['expires_at'] },
      ],
    }
  );
}
