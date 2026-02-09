import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class StockTransferItem extends Model {
  declare transferItemId: number;
  declare transferId: number;
  declare productId: number;
  declare batchId: number | null;
  declare quantityRequested: number;
  declare quantityTransferred: number;
  declare quantityReceived: number;
  declare notes: string | null;
}

export function initStockTransferItem(sequelize: Sequelize): void {
  StockTransferItem.init(
    {
      transferItemId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transferId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'stock_transfers', key: 'transfer_id' },
      },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      batchId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'batches', key: 'batch_id' } },
      quantityRequested: { type: DataTypes.INTEGER, allowNull: false },
      quantityTransferred: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      quantityReceived: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'StockTransferItem',
      tableName: 'stock_transfer_items',
      timestamps: false,
      indexes: [
        { fields: ['transfer_id'] },
        { fields: ['product_id'] },
      ],
    }
  );
}
