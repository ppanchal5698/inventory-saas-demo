import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class User extends Model {
  declare userId: number;
  declare username: string;
  declare passwordHash: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phone: string | null;
  declare profilePicture: string | null;
  declare role: 'admin' | 'manager' | 'staff' | 'viewer';
  declare status: 'active' | 'inactive' | 'pending_verification' | 'suspended';
  declare isActive: boolean;
  declare emailVerified: boolean;
  declare phoneVerified: boolean;
  declare twoFactorEnabled: boolean;
  declare twoFactorSecret: string | null;
  declare lastLoginAt: Date | null;
  declare lastLoginIp: string | null;
  declare failedLoginAttempts: number;
  declare lockedUntil: Date | null;
  declare passwordChangedAt: Date | null;
  declare preferences: unknown;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initUser(sequelize: Sequelize): void {
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
      firstName: { type: DataTypes.STRING(100), allowNull: false },
      lastName: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      profilePicture: { type: DataTypes.TEXT, allowNull: true },
      role: {
        type: DataTypes.ENUM('admin', 'manager', 'staff', 'viewer'),
        allowNull: false,
        defaultValue: 'staff',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending_verification', 'suspended'),
        allowNull: false,
        defaultValue: 'pending_verification',
      },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      emailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      phoneVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      twoFactorEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      twoFactorSecret: { type: DataTypes.STRING(100), allowNull: true },
      lastLoginAt: { type: DataTypes.DATE, allowNull: true },
      lastLoginIp: { type: DataTypes.STRING(45), allowNull: true },
      failedLoginAttempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      lockedUntil: { type: DataTypes.DATE, allowNull: true },
      passwordChangedAt: { type: DataTypes.DATE, allowNull: true },
      preferences: { type: DataTypes.JSON, allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['is_active'] },
        { fields: ['deleted_at'] },
        { fields: ['last_login_at'] },
      ],
    }
  );
}
