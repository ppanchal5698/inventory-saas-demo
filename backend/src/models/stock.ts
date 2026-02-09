import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

/**
 * Stock levels per product/warehouse.
 * quantity_available is a MySQL generated column (quantity_on_hand - quantity_reserved);
 * add it via post-sync-mysql.sql, do not define here.
 */
export class Stock extends Model {
  declare stockId: number;
  declare productId: number;
  declare warehouseId: number;
  declare locationId: number | null;
  declare quantityOnHand: number;
  declare quantityReserved: number;
  declare quantityInTransit: number;
  declare quantityDamaged: number;
  declare quantityExpired: number;
  declare reorderPoint: number | null;
  declare lastStockCheck: Date | null;
  declare lastStockCheckBy: number | null;
  declare averageCost: string | null;
  declare quantityAvailable: number; // Generated column
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initStock(sequelize: Sequelize): void {
  Stock.init(
    {
      stockId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'warehouses', key: 'warehouse_id' },
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'stock_locations', key: 'location_id' },
      },
      quantityOnHand: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      quantityReserved: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      quantityInTransit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      quantityDamaged: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      quantityExpired: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      reorderPoint: { type: DataTypes.INTEGER, allowNull: true },
      lastStockCheck: { type: DataTypes.DATE, allowNull: true },
      lastStockCheckBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      averageCost: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    },
    {
      sequelize,
      modelName: 'Stock',
      tableName: 'stock',
      indexes: [
        { unique: true, fields: ['product_id', 'warehouse_id'] },
        { fields: ['product_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['location_id'] },
        { fields: ['reorder_point'] },
      ],
    }
  );
}
