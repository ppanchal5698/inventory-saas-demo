import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class SupplierProduct extends Model {
  declare supplierProductId: number;
  declare supplierId: number;
  declare productId: number;
  declare supplierSku: string | null;
  declare supplierPrice: string;
  declare currency: string;
  declare leadTimeDays: number | null;
  declare minOrderQuantity: number;
  declare isPreferred: boolean | null;
  declare lastPurchaseDate: Date | null;
  declare lastPurchasePrice: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initSupplierProduct(sequelize: Sequelize): void {
  SupplierProduct.init(
    {
      supplierProductId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      supplierId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'suppliers', key: 'supplier_id' } },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      supplierSku: { type: DataTypes.STRING(100), allowNull: true },
      supplierPrice: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      currency: { type: DataTypes.STRING(10), allowNull: true, defaultValue: 'USD' },
      leadTimeDays: { type: DataTypes.INTEGER, allowNull: true },
      minOrderQuantity: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
      isPreferred: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      lastPurchaseDate: { type: DataTypes.DATEONLY, allowNull: true },
      lastPurchasePrice: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    },
    {
      sequelize,
      modelName: 'SupplierProduct',
      tableName: 'supplier_products',
      indexes: [
        { unique: true, fields: ['supplier_id', 'product_id'] },
        { fields: ['supplier_id'] },
        { fields: ['product_id'] },
        { fields: ['is_preferred'] },
      ],
    }
  );
}
