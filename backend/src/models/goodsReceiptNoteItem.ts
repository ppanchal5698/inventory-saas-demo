import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class GoodsReceiptNoteItem extends Model {
  declare grnItemId: number;
  declare grnId: number;
  declare poItemId: number | null;
  declare productId: number;
  declare batchId: number | null;
  declare quantityOrdered: number;
  declare quantityReceived: number;
  declare quantityAccepted: number;
  declare quantityRejected: number;
  declare rejectionReason: string | null;
  declare notes: string | null;
}

export function initGoodsReceiptNoteItem(sequelize: Sequelize): void {
  GoodsReceiptNoteItem.init(
    {
      grnItemId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      grnId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'goods_receipt_notes', key: 'grn_id' } },
      poItemId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'purchase_order_items', key: 'po_item_id' } },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      batchId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'batches', key: 'batch_id' } },
      quantityOrdered: { type: DataTypes.INTEGER, allowNull: false },
      quantityReceived: { type: DataTypes.INTEGER, allowNull: false },
      quantityAccepted: { type: DataTypes.INTEGER, allowNull: false },
      quantityRejected: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      rejectionReason: { type: DataTypes.TEXT, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'GoodsReceiptNoteItem',
      tableName: 'goods_receipt_note_items',
      timestamps: false,
      indexes: [{ fields: ['grn_id'] }, { fields: ['product_id'] }],
    }
  );
}
