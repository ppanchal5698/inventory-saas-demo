import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class ProductVariant extends Model {
  declare variantId: number;
  declare productId: number;
  declare variantCode: string;
  declare variantName: string;
  declare attributes: unknown;
  declare sku: string | null;
  declare barcode: string | null;
  declare price: string | null;
  declare costPrice: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initProductVariant(sequelize: Sequelize): void {
  ProductVariant.init(
    {
      variantId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      variantCode: { type: DataTypes.STRING(100), allowNull: false },
      variantName: { type: DataTypes.STRING(255), allowNull: false },
      attributes: { type: DataTypes.JSON, allowNull: true },
      sku: { type: DataTypes.STRING(100), allowNull: true },
      barcode: { type: DataTypes.STRING(100), allowNull: true },
      price: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      costPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'ProductVariant',
      tableName: 'product_variants',
      indexes: [
        { fields: ['product_id'] },
        { fields: ['sku'] },
        { fields: ['barcode'] },
      ],
    }
  );
}
