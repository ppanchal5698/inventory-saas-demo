import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class EmailVerificationToken extends Model {
  declare tokenId: number;
  declare userId: number;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare usedAt: Date | null;
  declare createdAt: Date;
}

export function initEmailVerificationToken(sequelize: Sequelize): void {
  EmailVerificationToken.init(
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
    },
    {
      sequelize,
      modelName: 'EmailVerificationToken',
      tableName: 'email_verification_tokens',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['expires_at'] },
      ],
    }
  );
}
