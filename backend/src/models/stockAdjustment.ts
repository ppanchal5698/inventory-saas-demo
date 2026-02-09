import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

/**
 * quantity_difference is a MySQL generated column (new_quantity - old_quantity);
 * add via post-sync-mysql.sql, do not define here.
 */
export class StockAdjustment extends Model {
  declare adjustmentId: number;
  declare organizationId: number;
  declare adjustmentNumber: string;
  declare productId: number;
  declare warehouseId: number;
  declare batchId: number | null;
  declare oldQuantity: number;
  declare newQuantity: number;
  declare reason: 'count_discrepancy' | 'damage' | 'theft' | 'expiry' | 'correction' | 'other';
  declare unitCost: string | null;
  declare notes: string | null;
  declare attachments: unknown;
  declare adjustedBy: number | null;
  declare approvedBy: number | null;
  declare adjustmentDate: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initStockAdjustment(sequelize: Sequelize): void {
  StockAdjustment.init(
    {
      adjustmentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      adjustmentNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'product_id' } },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'warehouses', key: 'warehouse_id' },
      },
      batchId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'batches', key: 'batch_id' } },
      oldQuantity: { type: DataTypes.INTEGER, allowNull: false },
      newQuantity: { type: DataTypes.INTEGER, allowNull: false },
      reason: {
        type: DataTypes.ENUM('count_discrepancy', 'damage', 'theft', 'expiry', 'correction', 'other'),
        allowNull: false,
      },
      unitCost: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      attachments: { type: DataTypes.JSON, allowNull: true },
      adjustedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      approvedBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      adjustmentDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'StockAdjustment',
      tableName: 'stock_adjustments',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['product_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['adjustment_date'] },
      ],
    }
  );
}
