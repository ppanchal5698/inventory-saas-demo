import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Batch extends Model {
  declare batchId: number;
  declare productId: number;
  declare warehouseId: number;
  declare batchNumber: string;
  declare manufacturingDate: Date | null;
  declare expiryDate: Date | null;
  declare quantity: number;
  declare quantityRemaining: number;
  declare purchasePrice: string | null;
  declare supplierLotNumber: string | null;
  declare notes: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initBatch(sequelize: Sequelize): void {
  Batch.init(
    {
      batchId: {
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
      batchNumber: { type: DataTypes.STRING(100), allowNull: false },
      manufacturingDate: { type: DataTypes.DATEONLY, allowNull: true },
      expiryDate: { type: DataTypes.DATEONLY, allowNull: true },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      quantityRemaining: { type: DataTypes.INTEGER, allowNull: false },
      purchasePrice: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      supplierLotNumber: { type: DataTypes.STRING(100), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'Batch',
      tableName: 'batches',
      indexes: [
        { unique: true, fields: ['product_id', 'batch_number'] },
        { fields: ['product_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['expiry_date'] },
        { fields: ['is_active'] },
      ],
    }
  );
}
