import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class CustomerPricing extends Model {
  declare pricingId: number;
  declare customerId: number;
  declare productId: number;
  declare price: string;
  declare minQuantity: number;
  declare validFrom: Date;
  declare validTo: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initCustomerPricing(sequelize: Sequelize): void {
  CustomerPricing.init(
    {
      pricingId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      customerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'customers', key: 'customer_id' } },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      minQuantity: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
      validFrom: { type: DataTypes.DATEONLY, allowNull: false },
      validTo: { type: DataTypes.DATEONLY, allowNull: true },
    },
    {
      sequelize,
      modelName: 'CustomerPricing',
      tableName: 'customer_pricing',
      indexes: [
        { fields: ['customer_id'] },
        { fields: ['product_id'] },
        { fields: ['valid_from', 'valid_to'] },
      ],
    }
  );
}
