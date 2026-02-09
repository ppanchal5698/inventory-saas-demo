import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class AuditLog extends Model {
  declare auditId: number;
  declare organizationId: number | null;
  declare userId: number | null;
  declare action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'logout' | 'approve' | 'reject';
  declare entityType: string;
  declare entityId: number | null;
  declare oldValues: unknown;
  declare newValues: unknown;
  declare changedFields: unknown;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare metadata: unknown;
  declare createdAt: Date;
}

export function initAuditLog(sequelize: Sequelize): void {
  AuditLog.init(
    {
      auditId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'organizations', key: 'organization_id' } },
      userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      action: {
        type: DataTypes.ENUM('create', 'update', 'delete', 'view', 'export', 'login', 'logout', 'approve', 'reject'),
        allowNull: false,
      },
      entityType: { type: DataTypes.STRING(50), allowNull: false },
      entityId: { type: DataTypes.INTEGER, allowNull: true },
      oldValues: { type: DataTypes.JSON, allowNull: true },
      newValues: { type: DataTypes.JSON, allowNull: true },
      changedFields: { type: DataTypes.JSON, allowNull: true },
      ipAddress: { type: DataTypes.STRING(45), allowNull: true },
      userAgent: { type: DataTypes.TEXT, allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'audit_logs',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['user_id'] },
        { fields: ['entity_type', 'entity_id'] },
        { fields: ['action'] },
        { fields: ['created_at'] },
      ],
    }
  );
}
