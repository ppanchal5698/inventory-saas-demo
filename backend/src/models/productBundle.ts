import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class ProductBundle extends Model {
  declare bundleId: number;
  declare bundleProductId: number;
  declare componentProductId: number;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initProductBundle(sequelize: Sequelize): void {
  ProductBundle.init(
    {
      bundleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bundleProductId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      componentProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'product_id' },
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: 'ProductBundle',
      tableName: 'product_bundles',
      indexes: [
        { fields: ['bundle_product_id'] },
        { fields: ['component_product_id'] },
      ],
    }
  );
}
