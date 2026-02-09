import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class StockLocation extends Model {
  declare locationId: number;
  declare warehouseId: number;
  declare locationType: 'zone' | 'aisle' | 'rack' | 'shelf' | 'bin';
  declare locationCode: string;
  declare parentLocationId: number | null;
  declare aisle: string | null;
  declare rack: string | null;
  declare shelf: string | null;
  declare bin: string | null;
  declare capacity: number | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initStockLocation(sequelize: Sequelize): void {
  StockLocation.init(
    {
      locationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'warehouses', key: 'warehouse_id' },
      },
      locationType: {
        type: DataTypes.ENUM('zone', 'aisle', 'rack', 'shelf', 'bin'),
        allowNull: false,
        defaultValue: 'bin',
      },
      locationCode: { type: DataTypes.STRING(50), allowNull: false },
      parentLocationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'stock_locations', key: 'location_id' },
      },
      aisle: { type: DataTypes.STRING(20), allowNull: true },
      rack: { type: DataTypes.STRING(20), allowNull: true },
      shelf: { type: DataTypes.STRING(20), allowNull: true },
      bin: { type: DataTypes.STRING(20), allowNull: true },
      capacity: { type: DataTypes.INTEGER, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'StockLocation',
      tableName: 'stock_locations',
      indexes: [
        { unique: true, fields: ['warehouse_id', 'location_code'] },
        { fields: ['warehouse_id'] },
        { fields: ['parent_location_id'] },
        { fields: ['is_active'] },
      ],
    }
  );
}
