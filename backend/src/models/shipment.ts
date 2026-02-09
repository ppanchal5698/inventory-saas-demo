import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Shipment extends Model {
  declare shipmentId: number;
  declare organizationId: number;
  declare shipmentNumber: string;
  declare orderId: number | null;
  declare carrierId: number | null;
  declare trackingNumber: string | null;
  declare shippedDate: Date | null;
  declare estimatedDelivery: Date | null;
  declare actualDelivery: Date | null;
  declare status: 'pending' | 'picked' | 'packed' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned' | 'cancelled';
  declare shippingCost: string | null;
  declare weight: string | null;
  declare dimensions: unknown;
  declare notes: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initShipment(sequelize: Sequelize): void {
  Shipment.init(
    {
      shipmentId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      shipmentNumber: { type: DataTypes.STRING(50), allowNull: false },
      orderId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'sales_orders', key: 'order_id' } },
      carrierId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'shipping_carriers', key: 'carrier_id' } },
      trackingNumber: { type: DataTypes.STRING(100), allowNull: true },
      shippedDate: { type: DataTypes.DATE, allowNull: true },
      estimatedDelivery: { type: DataTypes.DATE, allowNull: true },
      actualDelivery: { type: DataTypes.DATE, allowNull: true },
      status: {
        type: DataTypes.ENUM('pending', 'picked', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      shippingCost: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      weight: { type: DataTypes.DECIMAL(10, 3), allowNull: true },
      dimensions: { type: DataTypes.JSON, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Shipment',
      tableName: 'shipments',
      indexes: [
        { unique: true, fields: ['organization_id', 'shipment_number'] },
        { fields: ['organization_id'] },
        { fields: ['order_id'] },
        { fields: ['carrier_id'] },
        { fields: ['status'] },
        { fields: ['tracking_number'] },
      ],
    }
  );
}
