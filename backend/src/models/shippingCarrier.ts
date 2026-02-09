import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class ShippingCarrier extends Model {
  declare carrierId: number;
  declare organizationId: number;
  declare carrierName: string;
  declare carrierCode: string | null;
  declare contactPerson: string | null;
  declare phone: string | null;
  declare email: string | null;
  declare website: string | null;
  declare trackingUrlTemplate: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initShippingCarrier(sequelize: Sequelize): void {
  ShippingCarrier.init(
    {
      carrierId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      carrierName: { type: DataTypes.STRING(200), allowNull: false },
      carrierCode: { type: DataTypes.STRING(50), allowNull: true },
      contactPerson: { type: DataTypes.STRING(200), allowNull: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      email: { type: DataTypes.STRING(255), allowNull: true },
      website: { type: DataTypes.STRING(255), allowNull: true },
      trackingUrlTemplate: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { sequelize, modelName: 'ShippingCarrier', tableName: 'shipping_carriers', indexes: [{ fields: ['organization_id'] }, { fields: ['is_active'] }] }
  );
}
