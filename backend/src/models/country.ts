import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Country extends Model {
  declare countryId: number;
  declare countryName: string;
  declare countryCode: string;
  declare countryCode3: string | null;
  declare numericCode: string | null;
  declare phoneCode: string | null;
  declare currency: string | null;
  declare currencySymbol: string | null;
  declare flag: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initCountry(sequelize: Sequelize): void {
  Country.init(
    {
      countryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      countryName: { type: DataTypes.STRING(100), allowNull: false },
      countryCode: { type: DataTypes.STRING(2), allowNull: false, unique: true },
      countryCode3: { type: DataTypes.STRING(3), allowNull: true },
      numericCode: { type: DataTypes.STRING(10), allowNull: true },
      phoneCode: { type: DataTypes.STRING(10), allowNull: true },
      currency: { type: DataTypes.STRING(10), allowNull: true },
      currencySymbol: { type: DataTypes.STRING(10), allowNull: true },
      flag: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'Country',
      tableName: 'countries',
      indexes: [{ fields: ['is_active'] }],
    }
  );
}
