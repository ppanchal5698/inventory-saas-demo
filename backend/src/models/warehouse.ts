import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Warehouse extends Model {
  declare warehouseId: number;
  declare organizationId: number;
  declare warehouseCode: string;
  declare warehouseName: string;
  declare warehouseType: string | null;
  declare address: string | null;
  declare cityId: number | null;
  declare postalCode: string | null;
  declare managerUserId: number | null;
  declare phone: string | null;
  declare email: string | null;
  declare capacity: number | null;
  declare currentUtilization: number;
  declare coordinates: unknown;
  declare operatingHours: unknown;
  declare isActive: boolean;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initWarehouse(sequelize: Sequelize): void {
  Warehouse.init(
    {
      warehouseId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      warehouseCode: { type: DataTypes.STRING(50), allowNull: false },
      warehouseName: { type: DataTypes.STRING(200), allowNull: false },
      warehouseType: { type: DataTypes.STRING(50), allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      cityId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'cities', key: 'city_id' } },
      postalCode: { type: DataTypes.STRING(20), allowNull: true },
      managerUserId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      email: { type: DataTypes.STRING(255), allowNull: true },
      capacity: { type: DataTypes.INTEGER, allowNull: true },
      currentUtilization: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      coordinates: { type: DataTypes.JSON, allowNull: true },
      operatingHours: { type: DataTypes.JSON, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Warehouse',
      tableName: 'warehouses',
      paranoid: true,
      indexes: [
        { unique: true, fields: ['organization_id', 'warehouse_code'] },
        { fields: ['organization_id'] },
        { fields: ['city_id'] },
        { fields: ['manager_user_id'] },
        { fields: ['is_active'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
