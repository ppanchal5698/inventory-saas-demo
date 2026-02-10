import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class DeliveryNote extends Model {
  declare deliveryNoteId: number;
  declare organizationId: number;
  declare deliveryNoteNumber: string;
  declare orderId: number | null;
  declare shipmentId: number | null;
  declare deliveryDate: Date;
  declare deliveredBy: number | null;
  declare receivedBy: string | null;
  declare signature: string | null;
  declare notes: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initDeliveryNote(sequelize: Sequelize): void {
  DeliveryNote.init(
    {
      deliveryNoteId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      deliveryNoteNumber: { type: DataTypes.STRING(50), allowNull: false },
      orderId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'sales_orders', key: 'order_id' } },
      shipmentId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'shipments', key: 'shipment_id' } },
      deliveryDate: { type: DataTypes.DATEONLY, allowNull: false },
      deliveredBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      receivedBy: { type: DataTypes.STRING(200), allowNull: true },
      signature: { type: DataTypes.TEXT, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'DeliveryNote',
      tableName: 'delivery_notes',
      indexes: [
        { unique: true, fields: ['organization_id', 'delivery_note_number'] },
        { fields: ['organization_id'] },
        { fields: ['order_id'] },
        { fields: ['shipment_id'] },
      ],
    }
  );
}
