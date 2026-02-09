import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Brand extends Model {
  declare brandId: number;
  declare organizationId: number;
  declare brandName: string;
  declare slug: string | null;
  declare manufacturerName: string | null;
  declare logo: string | null;
  declare website: string | null;
  declare description: string | null;
  declare countryOfOrigin: number | null;
  declare isActive: boolean;
  declare metadata: unknown;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initBrand(sequelize: Sequelize): void {
  Brand.init(
    {
      brandId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      brandName: { type: DataTypes.STRING(200), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: true },
      manufacturerName: { type: DataTypes.STRING(200), allowNull: true },
      logo: { type: DataTypes.TEXT, allowNull: true },
      website: { type: DataTypes.STRING(255), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      countryOfOrigin: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'countries', key: 'country_id' } },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Brand',
      tableName: 'brands',
      paranoid: true,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['is_active'] },
        { fields: ['slug'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
