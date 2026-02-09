import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Category extends Model {
  declare categoryId: number;
  declare organizationId: number;
  declare categoryName: string;
  declare slug: string | null;
  declare parentCategoryId: number | null;
  declare description: string | null;
  declare image: string | null;
  declare displayOrder: number;
  declare level: number;
  declare path: string | null;
  declare isActive: boolean;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initCategory(sequelize: Sequelize): void {
  Category.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      categoryName: { type: DataTypes.STRING(200), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: true },
      parentCategoryId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'categories', key: 'category_id' } },
      description: { type: DataTypes.TEXT, allowNull: true },
      image: { type: DataTypes.TEXT, allowNull: true },
      displayOrder: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      level: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      path: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      paranoid: true,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['parent_category_id'] },
        { fields: ['is_active'] },
        { fields: ['slug'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
