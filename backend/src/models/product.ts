import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Product extends Model {
  declare productId: number;
  declare organizationId: number;
  declare productCode: string;
  declare productName: string;
  declare slug: string | null;
  declare description: string | null;
  declare shortDescription: string | null;
  declare categoryId: number | null;
  declare brandId: number | null;
  declare unitPrice: string;
  declare costPrice: string | null;
  declare listPrice: string | null;
  declare taxRateId: number | null;
  declare reorderLevel: number;
  declare minStockLevel: number;
  declare maxStockLevel: number | null;
  declare uomId: number | null;
  declare barcode: string | null;
  declare sku: string | null;
  declare hsnCode: string | null;
  declare weight: string | null;
  declare weightUomId: number | null;
  declare dimensions: unknown;
  declare isSerialized: boolean;
  declare isBatched: boolean;
  declare hasExpiryDate: boolean;
  declare isPerishable: boolean;
  declare shelfLife: number | null;
  declare warrantyPeriod: number | null;
  declare isActive: boolean;
  declare tags: unknown;
  declare attributes: unknown;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initProduct(sequelize: Sequelize): void {
  Product.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      productCode: { type: DataTypes.STRING(100), allowNull: false },
      productName: { type: DataTypes.STRING(255), allowNull: false },
      slug: { type: DataTypes.STRING(255), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      shortDescription: { type: DataTypes.STRING(500), allowNull: true },
      categoryId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'categories', key: 'category_id' } },
      brandId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'brands', key: 'brand_id' } },
      unitPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      costPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      listPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      taxRateId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'tax_rates', key: 'tax_rate_id' } },
      reorderLevel: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
      minStockLevel: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
      maxStockLevel: { type: DataTypes.INTEGER, allowNull: true },
      uomId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'unit_of_measures', key: 'uom_id' } },
      barcode: { type: DataTypes.STRING(100), allowNull: true },
      sku: { type: DataTypes.STRING(100), allowNull: true },
      hsnCode: { type: DataTypes.STRING(50), allowNull: true },
      weight: { type: DataTypes.DECIMAL(10, 3), allowNull: true },
      weightUomId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'unit_of_measures', key: 'uom_id' } },
      dimensions: { type: DataTypes.JSON, allowNull: true },
      isSerialized: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      isBatched: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      hasExpiryDate: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      isPerishable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      shelfLife: { type: DataTypes.INTEGER, allowNull: true },
      warrantyPeriod: { type: DataTypes.INTEGER, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      tags: { type: DataTypes.JSON, allowNull: true },
      attributes: { type: DataTypes.JSON, allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      paranoid: true,
      indexes: [
        { unique: true, fields: ['organization_id', 'product_code'] },
        { fields: ['organization_id'] },
        { fields: ['category_id'] },
        { fields: ['brand_id'] },
        { fields: ['is_active'] },
        { fields: ['slug'] },
        { fields: ['barcode'] },
        { fields: ['sku'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
