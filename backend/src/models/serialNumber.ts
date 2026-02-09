import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class SerialNumber extends Model {
  declare serialId: number;
  declare productId: number;
  declare serialNumber: string;
  declare batchId: number | null;
  declare warehouseId: number | null;
  declare status: string;
  declare purchaseDate: Date | null;
  declare warrantyExpiryDate: Date | null;
  declare notes: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initSerialNumber(sequelize: Sequelize): void {
  SerialNumber.init(
    {
      serialId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      serialNumber: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      batchId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'batches', key: 'batch_id' } },
      warehouseId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'warehouses', key: 'warehouse_id' } },
      status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'in_stock' },
      purchaseDate: { type: DataTypes.DATEONLY, allowNull: true },
      warrantyExpiryDate: { type: DataTypes.DATEONLY, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'SerialNumber',
      tableName: 'serial_numbers',
      indexes: [
        { fields: ['product_id'] },
        { fields: ['batch_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['status'] },
      ],
    }
  );
}
