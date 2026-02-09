import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class GoodsReceiptNote extends Model {
  declare grnId: number;
  declare organizationId: number;
  declare grnNumber: string;
  declare poId: number | null;
  declare warehouseId: number;
  declare receiptDate: Date;
  declare receivedBy: number | null;
  declare inspectedBy: number | null;
  declare qualityStatus: string;
  declare notes: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initGoodsReceiptNote(sequelize: Sequelize): void {
  GoodsReceiptNote.init(
    {
      grnId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      grnNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      poId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'purchase_orders', key: 'po_id' } },
      warehouseId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'warehouses', key: 'warehouse_id' } },
      receiptDate: { type: DataTypes.DATEONLY, allowNull: false },
      receivedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      inspectedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      qualityStatus: { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'pending' },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'GoodsReceiptNote',
      tableName: 'goods_receipt_notes',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['po_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['receipt_date'] },
      ],
    }
  );
}
