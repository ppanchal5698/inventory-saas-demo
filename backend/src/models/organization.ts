import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Organization extends Model {
  declare organizationId: number;
  declare organizationName: string;
  declare slug: string;
  declare description: string | null;
  declare logo: string | null;
  declare website: string | null;
  declare email: string | null;
  declare phone: string | null;
  declare address: string | null;
  declare cityId: number | null;
  declare postalCode: string | null;
  declare taxId: string | null;
  declare registrationNumber: string | null;
  declare status: 'trial' | 'active' | 'suspended' | 'cancelled';
  declare settings: unknown;
  declare metadata: unknown;
  declare trialEndsAt: Date | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initOrganization(sequelize: Sequelize): void {
  Organization.init(
    {
      organizationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationName: { type: DataTypes.STRING(200), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      logo: { type: DataTypes.TEXT, allowNull: true },
      website: { type: DataTypes.STRING(255), allowNull: true },
      email: { type: DataTypes.STRING(255), allowNull: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      cityId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'cities', key: 'city_id' } },
      postalCode: { type: DataTypes.STRING(20), allowNull: true },
      taxId: { type: DataTypes.STRING(50), allowNull: true },
      registrationNumber: { type: DataTypes.STRING(50), allowNull: true },
      status: {
        type: DataTypes.ENUM('trial', 'active', 'suspended', 'cancelled'),
        allowNull: false,
        defaultValue: 'trial',
      },
      settings: { type: DataTypes.JSON, allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      trialEndsAt: { type: DataTypes.DATE, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Organization',
      tableName: 'organizations',
      paranoid: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['is_active'] },
        { fields: ['city_id'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
