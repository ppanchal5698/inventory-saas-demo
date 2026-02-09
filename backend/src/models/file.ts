import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class File extends Model {
  declare fileId: number;
  declare organizationId: number;
  declare fileName: string;
  declare fileType: 'image' | 'document' | 'spreadsheet' | 'pdf' | 'video' | 'audio' | 'archive' | 'other';
  declare mimeType: string | null;
  declare fileSize: number;
  declare filePath: string;
  declare fileUrl: string | null;
  declare entityType: string | null;
  declare entityId: number | null;
  declare uploadedBy: number | null;
  declare isPublic: boolean | null;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initFile(sequelize: Sequelize): void {
  File.init(
    {
      fileId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      fileName: { type: DataTypes.STRING(255), allowNull: false },
      fileType: {
        type: DataTypes.ENUM('image', 'document', 'spreadsheet', 'pdf', 'video', 'audio', 'archive', 'other'),
        allowNull: false,
      },
      mimeType: { type: DataTypes.STRING(100), allowNull: true },
      fileSize: { type: DataTypes.INTEGER, allowNull: false },
      filePath: { type: DataTypes.TEXT, allowNull: false },
      fileUrl: { type: DataTypes.TEXT, allowNull: true },
      entityType: { type: DataTypes.STRING(50), allowNull: true },
      entityId: { type: DataTypes.INTEGER, allowNull: true },
      uploadedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      isPublic: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      metadata: { type: DataTypes.JSON, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'File',
      tableName: 'files',
      paranoid: true,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['entity_type', 'entity_id'] },
        { fields: ['file_type'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
