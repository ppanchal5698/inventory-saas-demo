import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class ProductImage extends Model {
  declare imageId: number;
  declare productId: number;
  declare imageUrl: string;
  declare altText: string | null;
  declare displayOrder: number;
  declare isPrimary: boolean | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initProductImage(sequelize: Sequelize): void {
  ProductImage.init(
    {
      imageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      imageUrl: { type: DataTypes.TEXT, allowNull: false },
      altText: { type: DataTypes.STRING(255), allowNull: true },
      displayOrder: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      isPrimary: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'product_images',
      indexes: [
        { fields: ['product_id'] },
        { fields: ['product_id', 'is_primary'] },
      ],
    }
  );
}
