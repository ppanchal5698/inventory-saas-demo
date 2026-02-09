import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class StockReservation extends Model {
  declare reservationId: number;
  declare productId: number;
  declare warehouseId: number;
  declare referenceType: string;
  declare referenceId: number;
  declare quantity: number;
  declare reservedUntil: Date | null;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initStockReservation(sequelize: Sequelize): void {
  StockReservation.init(
    {
      reservationId: {
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
      referenceType: { type: DataTypes.STRING(50), allowNull: false },
      referenceId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      reservedUntil: { type: DataTypes.DATE, allowNull: true },
      status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'active' },
    },
    {
      sequelize,
      modelName: 'StockReservation',
      tableName: 'stock_reservations',
      indexes: [
        { fields: ['product_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['reference_type', 'reference_id'] },
        { fields: ['status'] },
      ],
    }
  );
}
